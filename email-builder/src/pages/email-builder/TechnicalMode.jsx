import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import StyleControls from "../../components/shared/StyleControls";
import generateEmailTemplate from "../../utils/emailTemplate";

const API_URL = "http://localhost:5000";

// Quill editor formats
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "background",
  "align",
  "code-block",
  "script",
];

// Editor configurations for different sections
const editorConfigs = {
  header: {
    modules: {
      toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
      ],
    },
    formats: formats,
    placeholder: "Enter header content...",
    theme: "snow",
  },
  content: {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "blockquote", "code-block"],
        ["clean"],
      ],
    },
    formats: formats,
    placeholder: "Enter main content...",
    theme: "snow",
  },
  footer: {
    modules: {
      toolbar: [
        [{ size: ["small", false, "large"] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    },
    formats: formats,
    placeholder: "Enter footer content...",
    theme: "snow",
  },
};

const TechnicalMode = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [sections, setSections] = useState({
    header: "",
    content: "",
    footer: "",
  });
  const [imageStyles, setImageStyles] = useState({
    width: "100%",
    maxHeight: "300px",
    alignment: "center",
  });
  const [styles, setStyles] = useState({
    header: {
      fontSize: "24px",
      color: "#000000",
      backgroundColor: "transparent",
      padding: "10px",
      textAlign: "left",
      fontFamily: "Arial",
    },
    content: {
      fontSize: "16px",
      color: "#333333",
      backgroundColor: "transparent",
      padding: "15px",
      textAlign: "left",
      fontFamily: "Arial",
      lineHeight: "1.5",
    },
    footer: {
      fontSize: "14px",
      color: "#666666",
      backgroundColor: "transparent",
      padding: "10px",
      textAlign: "center",
      fontFamily: "Arial",
    },
  });

  const handleSectionChange = (section, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const handleImageStyleChange = (property, value) => {
    setImageStyles((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/uploadImage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    }
  };

  const handleStyleChange = (section, property, value) => {
    setStyles((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [property]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!sections.header.trim()) errors.header = "Header content is required";
    if (!sections.content.trim()) errors.content = "Content is required";
    if (!sections.footer.trim()) errors.footer = "Footer content is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/uploadEmailConfig`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: JSON.stringify({
            sections,
            imageStyles,
            styles,
            imageUrl,
            layout: {
              header: {
                content: sections.header,
                styles: styles.header,
              },
              content: {
                content: sections.content,
                styles: styles.content,
              },
              footer: {
                content: sections.footer,
                styles: styles.footer,
              },
              image: {
                ...imageStyles,
                url: imageUrl,
              },
            },
          }),
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out";
      successMessage.textContent = "Template saved successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);

      // Clear validation errors
      setValidationErrors({});
      setError("");
    } catch (error) {
      console.error("Error saving template:", error);
      setError("Failed to save template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const htmlContent = generateEmailTemplate({
        title: title || "Email Template",
        sections,
        styles,
        imageUrl,
        imageStyles,
        API_URL,
      });

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-template.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading template:", error);
      setError("Failed to download template. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Email Template Builder
            </h1>
            <p className="text-gray-600 mt-2">
              Create beautiful email templates with ease
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition-all duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            Change Mode
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-0">
            {/* Editor Side */}
            <div className="p-8 border-r border-gray-200 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <div className="space-y-8">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Template Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setValidationErrors({ ...validationErrors, title: "" });
                    }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      validationErrors.title
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter template title..."
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.title}
                    </p>
                  )}
                </div>

                {/* Header Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Header Section <span className="text-red-500">*</span>
                  </label>
                  <div className="h-[150px] mb-4">
                    <ReactQuill
                      value={sections.header}
                      onChange={(value) => {
                        handleSectionChange("header", value);
                        setValidationErrors({
                          ...validationErrors,
                          header: "",
                        });
                      }}
                      {...editorConfigs.header}
                      className={`h-full ${
                        validationErrors.header ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {validationErrors.header && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.header}
                    </p>
                  )}
                  <div className="mt-4">
                    <StyleControls
                      section="header"
                      styles={styles}
                      handleStyleChange={handleStyleChange}
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image Section
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="mt-2 text-sm">Select an image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setImageFile(file);
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </label>
                    </div>
                    {imageUrl && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Width
                          </label>
                          <select
                            value={imageStyles.width}
                            onChange={(e) =>
                              handleImageStyleChange("width", e.target.value)
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="100%">Full Width</option>
                            <option value="75%">75%</option>
                            <option value="50%">50%</option>
                            <option value="25%">25%</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Max Height
                          </label>
                          <select
                            value={imageStyles.maxHeight}
                            onChange={(e) =>
                              handleImageStyleChange(
                                "maxHeight",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="200px">Small</option>
                            <option value="300px">Medium</option>
                            <option value="400px">Large</option>
                            <option value="500px">Extra Large</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Alignment
                          </label>
                          <select
                            value={imageStyles.alignment}
                            onChange={(e) =>
                              handleImageStyleChange(
                                "alignment",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content Section <span className="text-red-500">*</span>
                  </label>
                  <div className="h-[250px] mb-4">
                    <ReactQuill
                      value={sections.content}
                      onChange={(value) => {
                        handleSectionChange("content", value);
                        setValidationErrors({
                          ...validationErrors,
                          content: "",
                        });
                      }}
                      {...editorConfigs.content}
                      className={`h-full ${
                        validationErrors.content ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {validationErrors.content && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.content}
                    </p>
                  )}
                  <div className="mt-4">
                    <StyleControls
                      section="content"
                      styles={styles}
                      handleStyleChange={handleStyleChange}
                    />
                  </div>
                </div>

                {/* Footer Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Footer Section <span className="text-red-500">*</span>
                  </label>
                  <div className="h-[150px] mb-4">
                    <ReactQuill
                      value={sections.footer}
                      onChange={(value) => {
                        handleSectionChange("footer", value);
                        setValidationErrors({
                          ...validationErrors,
                          footer: "",
                        });
                      }}
                      {...editorConfigs.footer}
                      className={`h-full ${
                        validationErrors.footer ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {validationErrors.footer && (
                    <p className="mt-1 text-sm text-red-500">
                      {validationErrors.footer}
                    </p>
                  )}
                  <div className="mt-4">
                    <StyleControls
                      section="footer"
                      styles={styles}
                      handleStyleChange={handleStyleChange}
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                          />
                        </svg>
                        <span>Save Template</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        <span>Download HTML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="bg-gray-50 p-8">
              <div className="sticky top-8">
                <div className="flex items-center space-x-2 mb-6">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-800">
                    Live Preview
                  </h2>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  {sections.header && (
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{ __html: sections.header }}
                      style={styles.header}
                    />
                  )}
                  {imageUrl && (
                    <div className={`mb-4 text-${imageStyles.alignment}`}>
                      <img
                        src={`${API_URL}${imageUrl}`}
                        alt="Preview"
                        style={{
                          width: imageStyles.width,
                          maxHeight: imageStyles.maxHeight,
                          display:
                            imageStyles.alignment === "center"
                              ? "block"
                              : "inline",
                          margin:
                            imageStyles.alignment === "center" ? "0 auto" : "0",
                        }}
                      />
                    </div>
                  )}
                  {sections.content && (
                    <div
                      className="mb-4"
                      dangerouslySetInnerHTML={{ __html: sections.content }}
                      style={styles.content}
                    />
                  )}
                  {sections.footer && (
                    <div
                      className="mt-6 pt-4 border-t"
                      dangerouslySetInnerHTML={{ __html: sections.footer }}
                      style={styles.footer}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalMode;
