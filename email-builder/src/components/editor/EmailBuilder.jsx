import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const EmailBuilder = () => {
  const [mode, setMode] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [emailLayout, setEmailLayout] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/templates`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTitle(template.title);
    try {
      const parsedContent = JSON.parse(template.content);

      // Set sections content
      setSections({
        header: parsedContent.layout?.header?.content || "",
        content:
          parsedContent.layout?.content?.content ||
          parsedContent.sections?.content ||
          "",
        footer: parsedContent.layout?.footer?.content || "",
      });

      // Set styles if available
      if (parsedContent.styles) {
        setStyles(parsedContent.styles);
      }

      // Set image styles and URL
      setImageStyles(
        parsedContent.layout?.image || parsedContent.imageStyles || imageStyles
      );
      // Set image URL from the saved content
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
        content: template.content,
        footer: "",
      });
      setImageUrl(template.imageUrl || "");
    }
  };

  const handleSectionChange = (section, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const getComposedContent = () => {
    if (mode === "technical") {
      return JSON.stringify({
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
      });
    }
    return content;
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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageFile(null);
    setImageUrl("");
    setSelectedTemplate(null);
    setEmailLayout("");
    Object.keys(editorRefs).forEach((section) => {
      if (editorRefs[section].current) {
        editorRefs[section].current.setContent("");
      }
    });
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    // Don't reset form when switching modes
    if (!selectedMode) {
      resetForm(); // Only reset when going back to mode selection
    }
  };

  const fetchLayout = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Get current content from sections
      const currentContent =
        mode === "technical"
          ? {
              header: sections.header,
              content: sections.content,
              footer: sections.footer,
              imageUrl: imageUrl,
              styles: styles,
              imageStyles: imageStyles,
            }
          : sections;

      // Create preview HTML directly instead of fetching from server
      const previewHTML = `
        <div class="preview-container">
          <div class="header" style="${Object.entries(styles.header)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; ")}">
            ${sections.header}
          </div>
          ${
            imageUrl
              ? `
            <div class="image-container" style="text-align: ${
              imageStyles.alignment
            }">
              <img 
                src="${API_URL}${imageUrl}" 
                alt="Email Image"
                style="
                  width: ${imageStyles.width};
                  max-height: ${imageStyles.maxHeight};
                  ${
                    imageStyles.alignment === "center"
                      ? "display: block; margin: 0 auto;"
                      : ""
                  }
                "
              />
            </div>
          `
              : ""
          }
          <div class="content" style="${Object.entries(styles.content)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; ")}">
            ${sections.content}
          </div>
          <div class="footer" style="${Object.entries(styles.footer)
            .map(([key, value]) => `${key}: ${value}`)
            .join("; ")}">
            ${sections.footer}
          </div>
        </div>
      `;

      setEmailLayout(previewHTML);
    } catch (error) {
      console.error("Error generating preview:", error);
      setError("Failed to generate preview. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          content: getComposedContent(),
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      // Update preview immediately after saving
      await fetchLayout();
      await fetchTemplates();
      alert("Email template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      setError("Failed to save template. Please try again.");
    } finally {
      setIsLoading(false);
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

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .preview-container {
        background: #ffffff;
        border-radius: 4px;
      }
      .header {
        ${Object.entries(styles.header)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
      }
      .content {
        ${Object.entries(styles.content)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
      }
      .footer {
        ${Object.entries(styles.footer)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
      }
      .image-container {
        text-align: ${imageStyles.alignment};
        margin: 20px 0;
      }
      .image-container img {
        width: ${imageStyles.width};
        max-height: ${imageStyles.maxHeight};
        ${
          imageStyles.alignment === "center"
            ? "display: block; margin: 0 auto;"
            : ""
        }
        ${
          imageStyles.alignment === "left"
            ? "float: left; margin-right: 20px;"
            : ""
        }
        ${
          imageStyles.alignment === "right"
            ? "float: right; margin-left: 20px;"
            : ""
        }
      }
      /* Quill specific styles */
      .ql-align-center, [style*="text-align: center"] {
        text-align: center !important;
      }
      .ql-align-right, [style*="text-align: right"] {
        text-align: right !important;
      }
      .ql-align-left, [style*="text-align: left"] {
        text-align: left !important;
      }
      .ql-align-justify, [style*="text-align: justify"] {
        text-align: justify !important;
      }
      /* Font sizes */
      .ql-size-small {
        font-size: 0.75em !important;
      }
      .ql-size-large {
        font-size: 1.5em !important;
      }
      .ql-size-huge {
        font-size: 2.5em !important;
      }
      /* Headers */
      h1 { font-size: 2em !important; }
      h2 { font-size: 1.5em !important; }
      h3 { font-size: 1.17em !important; }
      h4 { font-size: 1em !important; }
      h5 { font-size: 0.83em !important; }
      h6 { font-size: 0.75em !important; }
      /* Lists */
      .ql-indent-1 { padding-left: 3em !important; }
      .ql-indent-2 { padding-left: 6em !important; }
      .ql-indent-3 { padding-left: 9em !important; }
      /* Rich text elements */
      p { margin: 0 0 1em 0; }
      strong { font-weight: bold !important; }
      em { font-style: italic !important; }
      u { text-decoration: underline !important; }
      s { text-decoration: line-through !important; }
      blockquote {
        border-left: 4px solid #ccc !important;
        margin: 1.5em 10px !important;
        padding: 0.5em 10px !important;
      }
      /* Lists */
      ul, ol {
        margin: 1em 0 !important;
        padding-left: 2em !important;
      }
      li {
        margin-bottom: 0.5em !important;
      }
      /* Links */
      a {
        color: #06c !important;
        text-decoration: underline !important;
      }
      /* Preserve styles for all elements */
      .header *, .content *, .footer * {
        text-align: inherit !important;
        background-color: inherit !important;
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        line-height: inherit !important;
      }
      /* Additional alignment preservation */
      [style*="text-align"] {
        text-align: inherit !important;
      }
      /* Responsive design */
      @media (max-width: 768px) {
        .container {
          margin: 20px;
          padding: 20px;
        }
      }
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
            style="
              width: ${imageStyles.width}; 
              max-height: ${imageStyles.maxHeight}; 
              ${
                imageStyles.alignment === "center"
                  ? "display: block; margin: 0 auto;"
                  : ""
              }
              ${
                imageStyles.alignment === "left"
                  ? "float: left; margin-right: 20px;"
                  : ""
              }
              ${
                imageStyles.alignment === "right"
                  ? "float: right; margin-left: 20px;"
                  : ""
              }
            "
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

    // Create blob and download
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

  const StyleControls = ({ section }) => (
    <div className="grid grid-cols-2 gap-2 mt-2 p-2 bg-gray-100 rounded">
      <div>
        <label className="block text-xs mb-1">Font Size</label>
        <select
          value={styles[section].fontSize}
          onChange={(e) =>
            handleStyleChange(section, "fontSize", e.target.value)
          }
          className="w-full p-1 border rounded text-sm"
        >
          {["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"].map(
            (size) => (
              <option key={size} value={size}>
                {size}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Font Family</label>
        <select
          value={styles[section].fontFamily}
          onChange={(e) =>
            handleStyleChange(section, "fontFamily", e.target.value)
          }
          className="w-full p-1 border rounded text-sm"
        >
          {["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana"].map(
            (font) => (
              <option key={font} value={font}>
                {font}
              </option>
            )
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Text Color</label>
        <input
          type="color"
          value={styles[section].color}
          onChange={(e) => handleStyleChange(section, "color", e.target.value)}
          className="w-full p-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Background</label>
        <input
          type="color"
          value={
            styles[section].backgroundColor === "transparent"
              ? "#ffffff"
              : styles[section].backgroundColor
          }
          onChange={(e) =>
            handleStyleChange(section, "backgroundColor", e.target.value)
          }
          className="w-full p-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">Alignment</label>
        <select
          value={styles[section].textAlign}
          onChange={(e) =>
            handleStyleChange(section, "textAlign", e.target.value)
          }
          className="w-full p-1 border rounded text-sm"
        >
          {["left", "center", "right", "justify"].map((align) => (
            <option key={align} value={align}>
              {align}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">Padding</label>
        <select
          value={styles[section].padding}
          onChange={(e) =>
            handleStyleChange(section, "padding", e.target.value)
          }
          className="w-full p-1 border rounded text-sm"
        >
          {["5px", "10px", "15px", "20px", "25px", "30px"].map((padding) => (
            <option key={padding} value={padding}>
              {padding}
            </option>
          ))}
        </select>
      </div>
      {section === "content" && (
        <div>
          <label className="block text-xs mb-1">Line Height</label>
          <select
            value={styles.content.lineHeight}
            onChange={(e) =>
              handleStyleChange("content", "lineHeight", e.target.value)
            }
            className="w-full p-1 border rounded text-sm"
          >
            {["1", "1.2", "1.5", "1.8", "2"].map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderTemplatePreview = (template) => {
    let templateData = {};
    try {
      const parsedContent = JSON.parse(template.content);
      templateData = {
        styles: parsedContent.styles || {},
        layout: parsedContent.layout || {},
        imageUrl:
          parsedContent.imageUrl ||
          parsedContent.layout?.image?.url ||
          template.imageUrl,
      };
    } catch (e) {
      console.error("Error parsing template styles:", e);
      return null;
    }

    return (
      <div className="text-sm text-gray-600 mt-2">
        {templateData.styles.header && (
          <div style={templateData.styles.header} className="mb-2">
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.header?.content || "",
              }}
            />
          </div>
        )}
        {templateData.imageUrl && (
          <div className="mt-2">
            <img
              src={`${API_URL}${templateData.imageUrl}`}
              alt="Template preview"
              className="max-h-20 rounded"
              style={{
                width: templateData.layout.image?.width || "100%",
                maxHeight: templateData.layout.image?.maxHeight || "300px",
                display:
                  templateData.layout.image?.alignment === "center"
                    ? "block"
                    : "inline",
                margin:
                  templateData.layout.image?.alignment === "center"
                    ? "0 auto"
                    : "0",
                float: templateData.layout.image?.alignment,
              }}
            />
          </div>
        )}
        {templateData.styles.content && (
          <div style={templateData.styles.content}>
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.content?.content || "",
              }}
            />
          </div>
        )}
        {templateData.styles.footer && (
          <div style={templateData.styles.footer} className="mt-2">
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.footer?.content || "",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderSimpleMode = () => (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Choose a Template</h2>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template._id}
              className={`border rounded p-4 cursor-pointer transition-colors ${
                selectedTemplate?._id === template._id
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <h3 className="font-medium text-lg">{template.title}</h3>
              {renderTemplatePreview(template)}
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
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

              <button
                type="button"
                onClick={fetchLayout}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Preview
              </button>
            </form>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Live Preview</h2>
              <button
                type="button"
                onClick={handleDownload}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download HTML
              </button>
            </div>
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
      )}
    </div>
  );

  const renderTechnicalMode = () => (
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
          <StyleControls section="header" />
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
          <StyleControls section="content" />
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
          <StyleControls section="footer" />
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
                    imageStyles.alignment === "center" ? "block" : "inline",
                  margin: imageStyles.alignment === "center" ? "0 auto" : "0",
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
  );

  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-12">
            Choose Your Email Builder Mode
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical User Card */}
            <div
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleModeSelect("technical")}
            >
              <div className="h-12 w-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Technical User Mode</h2>
              <p className="text-gray-600">
                Full access to rich text editor with advanced formatting
                options. Create custom templates from scratch.
              </p>
              <ul className="mt-4 text-sm text-gray-500">
                <li>• Rich text editing tools</li>
                <li>• Custom formatting</li>
                <li>• Advanced layout options</li>
                <li>• Save templates for others</li>
              </ul>
            </div>

            {/* Non-Technical User Card */}
            <div
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleModeSelect("simple")}
            >
              <div className="h-12 w-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Simple Mode</h2>
              <p className="text-gray-600">
                Easy-to-use interface with pre-made templates. Just fill in your
                content.
              </p>
              <ul className="mt-4 text-sm text-gray-500">
                <li>• Pre-made templates</li>
                <li>• Simple text input</li>
                <li>• Easy image upload</li>
                <li>• Quick preview</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {mode === "technical"
              ? "Email Template Builder"
              : "Use Email Template"}
          </h1>
          <button
            onClick={() => handleModeSelect(null)}
            className="text-gray-600 hover:text-gray-800"
          >
            Change Mode
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
        )}

        {mode === "technical" ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderTechnicalMode()}
          </div>
        ) : (
          renderSimpleMode()
        )}
      </div>
    </div>
  );
};

export default EmailBuilder;
