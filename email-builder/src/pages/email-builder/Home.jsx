import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-0"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-gray-900 mb-6"
            >
              Email Builder
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-blue-600"
              >
                {" "}
                Pro
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Create beautiful, responsive email templates with ease. Choose
              between technical and simple modes to match your expertise level.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex justify-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/tools")}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl"
              >
                Get Started
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#guide"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mode Selection */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Technical User Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="group bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={() => navigate("/tools")}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-6 flex items-center justify-center"
            >
              <svg
                className="h-7 w-7 text-white"
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
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Technical User Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Full access to rich text editor with advanced formatting options.
              Create custom templates from scratch.
            </p>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Rich text editing tools
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Custom formatting
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Advanced layout options
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save templates for others
              </li>
            </ul>
          </motion.div>

          {/* Non-Technical User Card */}
          <motion.div
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            className="group bg-white rounded-2xl shadow-xl p-8 cursor-pointer hover:shadow-2xl transition-all duration-300"
            onClick={() => navigate("/non-tech")}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-6 flex items-center justify-center"
            >
              <svg
                className="h-7 w-7 text-white"
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
            </motion.div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Simple Mode
            </h2>
            <p className="text-gray-600 mb-6">
              Easy-to-use interface with pre-made templates. Just fill in your
              content.
            </p>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Pre-made templates
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Simple text input
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Easy image upload
              </li>
              <li className="flex items-center">
                <svg
                  className="h-5 w-5 mr-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Quick preview
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* User Guide Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="guide"
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How to Use Email Builder Pro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to create beautiful email templates in
              minutes
            </p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Choose Your Mode
              </h3>
              <p className="text-gray-600">
                Select between Technical or Simple mode based on your expertise
                level
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Create or Edit
              </h3>
              <p className="text-gray-600">
                Design your template from scratch or customize existing
                templates
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Download & Use
              </h3>
              <p className="text-gray-600">
                Export your template as HTML and use it in your email campaigns
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* About Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About Email Builder Pro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A powerful email template builder designed to make email creation
              accessible to everyone
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 mr-3 text-blue-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      User-Friendly Interface
                    </h4>
                    <p className="text-gray-600">
                      Intuitive design that makes email creation a breeze
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 mr-3 text-blue-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Responsive Templates
                    </h4>
                    <p className="text-gray-600">
                      All templates are mobile-friendly and work across devices
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 mr-3 text-blue-500 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Advanced Customization
                    </h4>
                    <p className="text-gray-600">
                      Full control over design elements in Technical mode
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Rich Text Editor
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Advanced formatting options
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Image Support
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Easy image upload & management
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Template Library
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Pre-made professional designs
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    HTML Export
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Download ready-to-use templates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Email Builder Pro</h3>
              <p className="text-gray-400">
                Create beautiful email templates with ease
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#guide"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    User Guide
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/tools")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Technical Mode
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/non-tech")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Simple Mode
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">
                Have questions? Reach out to us at
                <br />
                <a
                  href="mailto:support@emailbuilder.pro"
                  className="text-blue-400 hover:text-blue-300"
                >
                  support@emailbuilder.pro
                </a>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Email Builder Pro. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
