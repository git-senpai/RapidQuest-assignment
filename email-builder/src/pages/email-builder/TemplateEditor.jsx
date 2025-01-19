import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import generateEmailTemplate from "../../utils/emailTemplate";

const API_URL = "http://localhost:5000";

const TemplateEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = location.state?.template;
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const [sections, setSections] = useState({
    header: "",
    content: "",
    footer: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
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

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    if (!template) {
      navigate("/non-tech");
      return;
    }

    try {
      const parsedContent = JSON.parse(template.content);

      // Set sections content with stripped HTML
      setSections({
        header: stripHtml(parsedContent.layout?.header?.content || ""),
        content: stripHtml(
          parsedContent.layout?.content?.content ||
            parsedContent.sections?.content ||
            ""
        ),
        footer: stripHtml(parsedContent.layout?.footer?.content || ""),
      });

      // Set styles if available
      if (parsedContent.styles) {
        setStyles(parsedContent.styles);
      }

      // Set image styles and URL
      setImageStyles(
        parsedContent.layout?.image || parsedContent.imageStyles || imageStyles
      );
      setImageUrl(
        parsedContent.imageUrl ||
          parsedContent.layout?.image?.url ||
          template.imageUrl ||
          ""
      );
    } catch (e) {
      console.error("Error parsing template:", e);
      // Fallback for old templates
      setSections({
        header: "",
        content: stripHtml(template.content),
        footer: "",
      });
      setImageUrl(template.imageUrl || "");
    }
  }, [template, navigate]);

  const handleSectionChange = (section, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: value,
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // ... existing submission code ...
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
        title: template?.title || "Email Template",
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
      a.download = `${
        template?.title?.toLowerCase().replace(/\s+/g, "-") || "email"
      }-template.html`;
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Edit Template: {template?.title}
          </h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/non-tech")}
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Templates
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800"
            >
              Change Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customize Template</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Header</label>
                <textarea
                  value={sections.header}
                  onChange={(e) =>
                    handleSectionChange("header", e.target.value)
                  }
                  className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter header text..."
                  style={styles.header}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    if (file) handleImageUpload(file);
                  }}
                  className="w-full mb-2"
                />
                {imageUrl && (
                  <div className="space-y-2">
                    <img
                      src={`${API_URL}${imageUrl}`}
                      alt="Uploaded preview"
                      className="max-h-32 rounded"
                      style={imageStyles}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Content
                </label>
                <textarea
                  value={sections.content}
                  onChange={(e) =>
                    handleSectionChange("content", e.target.value)
                  }
                  className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter main content..."
                  style={styles.content}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Footer</label>
                <textarea
                  value={sections.footer}
                  onChange={(e) =>
                    handleSectionChange("footer", e.target.value)
                  }
                  className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter footer text..."
                  style={styles.footer}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </form>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Live Preview</h2>
            <div className="border rounded p-4">
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
                        imageStyles.alignment === "center" ? "block" : "inline",
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
  );
};

export default TemplateEditor;
