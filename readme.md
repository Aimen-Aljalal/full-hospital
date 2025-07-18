
## Hospital Management API

This project is a Node.js application that provides an API for managing hospital-related operations such as handling patients, doctors, appointments, real-time notifications, and file uploads. It integrates MongoDB for data storage, authentication, WebSocket communication, and PDF generation.

## Technologies & Libraries Used

### Backend Framework & Middleware
- Express – Lightweight Node.js framework for handling routes and middleware.
- Body-Parser – Parses incoming request bodies (JSON & URL-encoded data).
- CORS – Enables cross-origin resource sharing.

### Database & ORM
- MongoDB – NoSQL database for storing structured data.
- Mongoose – ODM for interacting with MongoDB in an object-oriented way.

### Authentication & Security
- BcryptJS – Hashes passwords for secure authentication.
- JSON Web Token (JWT) – Implements token-based authentication.
- Express-Session – Manages user sessions securely.

### Real-Time Communication
- Socket.IO – Enables real-time communication using WebSocket protocol.

### File Handling & PDF Generation
- Multer – Handles file uploads (e.g., patient reports or documents).
- PDFKit – Generates custom PDF files like reports or prescriptions.

### Validation
- Express-Validator – Validates user input to ensure clean and correct data.

### Development Tools
- Nodemon – Automatically restarts the server during development on file changes.

## Environment Variables (.env)

The project uses process.env to store sensitive configuration values such as:

- MongoDB connection string
- JWT secret key
- Session secret
- Any other private API keys

## How to Run the Project

1. Clone the repository:
```
git clone https://github.com/your-username/hospital-api.git
```

2. Install dependencies:
```
npm install
```

3. Create a .env file in the root directory and add your environment variables.

4. Run the application:
```
npm start
```