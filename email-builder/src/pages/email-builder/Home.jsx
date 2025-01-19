import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
            onClick={() => navigate("/tools")}
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
              Full access to rich text editor with advanced formatting options.
              Create custom templates from scratch.
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
            onClick={() => navigate("/non-tech")}
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
};

export default Home;
