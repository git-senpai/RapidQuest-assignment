# Email Builder Application

A modern email template builder application that allows users to create, customize, and manage email templates with a user-friendly interface. The application supports both technical and non-technical modes, making it accessible to users with different levels of expertise.

## 🚀 Features

### 💻 Technical Mode

- ✍️ **Rich text editor with HTML support**
- 🖼️ **Image upload and management using Cloudinary**
- 🎨 **Custom styling options for all template elements**
- 👀 **Real-time preview of email templates**
- 📱 **Responsive design controls**

### 🛠️ Non-Technical Mode

- 📂 **Pre-built template selection**
- 🖌️ **Simple customization interface**
- 🔍 **Visual template preview**
- 🗂️ **Easy template management**
- ⚡ **Quick template application**

### 🌟 General Features

- 💾 **Template saving and management**
- ⬇️ **Template download as HTML**
- ☁️ **Image hosting with Cloudinary**
- 📏 **Responsive design support**
- ✨ **Modern UI with animations and transitions**

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React.js**
- 🎨 **Tailwind CSS**
- 🖋️ **React Quill (Rich Text Editor)**
- 📡 **Axios for API calls**
- 🛤️ **React Router for navigation**

### Backend

- 🟢 **Node.js**
- 🖥️ **Express.js**
- 🗄️ **MongoDB**
- ☁️ **Cloudinary for image storage**
- 📤 **Multer for file handling**

## 📂 Project Structure

```plaintext
dev-email-builder/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
└── package.json

email-builder-backend/
├── src/
│   ├── models/
│   ├── routes/
│   └── server.js
└── package.json
```

## ⚙️ Setup Instructions

### Prerequisites

- 🖥️ **Node.js (v14 or higher)**
- 🗄️ **MongoDB**
- ☁️ **Cloudinary account**

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd email-builder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables:
   ```plaintext
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd email-builder-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables:
   ```plaintext
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## 🎉 Usage

### Technical Mode

- Access the technical mode to create custom email templates.
- Use the rich text editor to add and format content.
- Upload and customize images.
- Apply custom styles to template elements.

### Non-Technical Mode

- Browse pre-built templates.
- Select and customize templates.
- Preview templates before use.
- Download or save templates.

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🖋️ **React Quill** for the rich text editor
- ☁️ **Cloudinary** for image hosting
- 🎨 **Tailwind CSS** for styling
- 🗄️ **MongoDB** for database management
