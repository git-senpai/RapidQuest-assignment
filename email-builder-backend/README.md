# Email Builder Backend

Backend server for the Email Template Builder application.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a remote instance)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/emailBuilder
   ```

3. Create an `uploads` directory in the root folder:
   ```bash
   mkdir uploads
   ```

## Running the Server

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

## API Endpoints

- `GET /getEmailLayout` - Get the default email template layout
- `POST /uploadImage` - Upload an image file
- `POST /uploadEmailConfig` - Save email template configuration
- `GET /templates` - Get all saved email templates

## File Structure

```
email-builder-backend/
├── src/
│   └── server.js
├── uploads/
├── .env
├── package.json
└── README.md
```
