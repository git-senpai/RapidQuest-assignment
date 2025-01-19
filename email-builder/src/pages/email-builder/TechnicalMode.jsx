import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import StyleControls from "../../components/shared/StyleControls";

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
  const [error, setError] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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

      alert("Email template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      setError("Failed to save template. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      /* Your existing styles */
    </style>
</head>
<body>
    <div class="container">
      <div class="preview-container">
        <div class="header">
          ${sections.header}
        </div>
        ${
          imageUrl
            ? `
        <div class="image-container">
          <img 
            src="${API_URL}${imageUrl}" 
            alt="Email Image" 
            style="width: ${imageStyles.width}; max-height: ${
                imageStyles.maxHeight
              }; ${
                imageStyles.alignment === "center"
                  ? "display: block; margin: 0 auto;"
                  : ""
              }"
          />
        </div>
        `
            : ""
        }
        <div class="content">
          ${sections.content}
        </div>
        <div class="footer">
          ${sections.footer}
        </div>
      </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-template.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Email Template Builder</h1>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            Change Mode
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Editor Side */}
            <div className="space-y-6 overflow-y-auto max-h-screen pb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Header Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium mb-2">
                  Header Section
                </label>
                <ReactQuill
                  value={sections.header}
                  onChange={(value) => handleSectionChange("header", value)}
                  {...editorConfigs.header}
                />
                <StyleControls
                  section="header"
                  styles={styles}
                  handleStyleChange={handleStyleChange}
                />
              </div>

              {/* Image Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium mb-2">
                  Image Section
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      if (file) handleImageUpload(file);
                    }}
                    className="w-full"
                  />
                  {imageUrl && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs mb-1">Width</label>
                        <select
                          value={imageStyles.width}
                          onChange={(e) =>
                            handleImageStyleChange("width", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option value="100%">Full Width</option>
                          <option value="75%">75%</option>
                          <option value="50%">50%</option>
                          <option value="25%">25%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Max Height</label>
                        <select
                          value={imageStyles.maxHeight}
                          onChange={(e) =>
                            handleImageStyleChange("maxHeight", e.target.value)
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option value="200px">Small</option>
                          <option value="300px">Medium</option>
                          <option value="400px">Large</option>
                          <option value="500px">Extra Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Alignment</label>
                        <select
                          value={imageStyles.alignment}
                          onChange={(e) =>
                            handleImageStyleChange("alignment", e.target.value)
                          }
                          className="w-full p-1 border rounded"
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
              <div className="border rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium mb-2">
                  Content Section
                </label>
                <ReactQuill
                  value={sections.content}
                  onChange={(value) => handleSectionChange("content", value)}
                  {...editorConfigs.content}
                />
                <StyleControls
                  section="content"
                  styles={styles}
                  handleStyleChange={handleStyleChange}
                />
              </div>

              {/* Footer Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium mb-2">
                  Footer Section
                </label>
                <ReactQuill
                  value={sections.footer}
                  onChange={(value) => handleSectionChange("footer", value)}
                  {...editorConfigs.footer}
                />
                <StyleControls
                  section="footer"
                  styles={styles}
                  handleStyleChange={handleStyleChange}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleSubmit}
                >
                  Save Template
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleDownload}
                >
                  Download HTML
                </button>
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
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
  );
};

export default TechnicalMode;
