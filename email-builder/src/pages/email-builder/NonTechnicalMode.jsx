import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const NonTechnicalMode = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [deletingTemplates, setDeletingTemplates] = useState(new Set());
  const [error, setError] = useState("");

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
    e.stopPropagation(); // Prevent template selection when clicking delete
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

      // Remove template from state
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== templateId)
      );
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
      <div
        className="text-sm text-gray-600 mt-2 overflow-hidden"
        style={{ maxHeight: "150px" }}
      >
        {templateData.styles.header && (
          <div
            style={{ ...templateData.styles.header, fontSize: "12px" }}
            className="mb-1"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: templateData.layout.header?.content || "",
              }}
            />
          </div>
        )}
        {templateData.imageUrl && (
          <div className="mt-1">
            <img
              src={`${API_URL}${templateData.imageUrl}`}
              alt="Template preview"
              className="rounded"
              style={{
                width: "100%",
                maxHeight: "60px",
                objectFit: "cover",
              }}
            />
          </div>
        )}
        {templateData.styles.content && (
          <div style={{ ...templateData.styles.content, fontSize: "11px" }}>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Choose a Template</h1>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            Change Mode
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg truncate flex-1">
                    {template.title}
                  </h3>
                  <button
                    onClick={(e) => handleDeleteTemplate(e, template._id)}
                    className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50 transition-opacity"
                    disabled={deletingTemplates.has(template._id)}
                  >
                    {deletingTemplates.has(template._id) ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {renderTemplatePreview(template)}
              </div>
              <div className="bg-gray-50 px-4 py-3 border-t">
                <button className="w-full bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600">
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
