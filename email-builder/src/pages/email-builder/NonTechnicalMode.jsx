import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const NonTechnicalMode = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [deletingTemplates, setDeletingTemplates] = useState(new Set());
  const [error, setError] = useState("");
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_URL}/templates`);
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data);
      setError("");
    } catch (error) {
      console.error("Error fetching templates:", error);
      setError("Failed to load templates. Please try refreshing the page.");
    }
  };

  const handleTemplateSelect = (template) => {
    navigate("/template-editor", { state: { template } });
  };

  const handleDeleteTemplate = async (e, templateId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    setDeletingTemplates((prev) => new Set([...prev, templateId]));
    try {
      const response = await fetch(`${API_URL}/templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== templateId)
      );

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out";
      successMessage.textContent = "Template deleted successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);

      setError("");
    } catch (error) {
      console.error("Error deleting template:", error);
      setError("Failed to delete template. Please try again.");
    } finally {
      setDeletingTemplates((prev) => {
        const newSet = new Set(prev);
        newSet.delete(templateId);
        return newSet;
      });
    }
  };

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
      <div className="text-sm text-gray-600 overflow-hidden">
        {templateData.styles.header && (
          <div
            style={{ ...templateData.styles.header, fontSize: "12px" }}
            className="mb-1 line-clamp-1"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.header?.content || "",
              }}
            />
          </div>
        )}
        {templateData.imageUrl && (
          <div className="mt-1 relative h-32 overflow-hidden rounded-lg">
            <img
              src={templateData.imageUrl}
              alt="Template preview"
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        {templateData.styles.content && (
          <div
            style={{ ...templateData.styles.content, fontSize: "11px" }}
            className="mt-2 line-clamp-3"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.content?.content || "",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Email Templates
            </h1>
            <p className="text-gray-600 mt-2">Choose a template to customize</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template._id}
              className={`group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                hoveredTemplate === template._id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleTemplateSelect(template)}
              onMouseEnter={() => setHoveredTemplate(template._id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate flex-1">
                    {template.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteTemplate(e, template._id)}
                    className={`ml-2 p-2 rounded-full transition-all duration-200 ${
                      deletingTemplates.has(template._id)
                        ? "bg-gray-100 cursor-not-allowed"
                        : "hover:bg-red-50 text-red-500 hover:text-red-600"
                    }`}
                    disabled={deletingTemplates.has(template._id)}
                  >
                    {deletingTemplates.has(template._id) ? (
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="relative overflow-hidden rounded-lg">
                  {renderTemplatePreview(template)}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent h-16 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg transform transition-all duration-300 hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NonTechnicalMode;
