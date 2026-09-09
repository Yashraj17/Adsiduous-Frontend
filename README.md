# Adsiduous Multimedia Upload, Search & Ranking Platform

A scalable full-stack web application designed for securely uploading, storing, searching, previewing, and ranking multimedia assets (Images, Videos, Audio, and PDFs).

Built as part of the **Adsiduous Technical Assessment Task**.

---

## 🌟 Key Features

- **Multi-Format Media Support**: Upload and preview Images (`JPG`, `PNG`, `WEBP`), Videos (`MP4`, `WEBM`), Audio tracks (`MP3`, `WAV`), and Documents (`PDF`).
- **Cloud & Fallback Storage**: Seamless Cloudinary integration with automated streaming uploads, public ID deletion, and local fallback storage mode.
- **Secure JWT Authentication**: User registration and login flow featuring short-lived Access Tokens and HTTP-only Refresh Token cookie rotation.
- **Full-Text Search & Relevance Ranking**: Multi-factor scoring algorithm combining keyword text score, view count popularity, and recency weight:
  $$\text{Relevance} = (\text{TextMatchScore} \times 0.5) + (\ln(\text{ViewsCount} + 1) \times 0.3) + (\text{RecencyBonus} \times 0.2)$$
- **Interactive Universal Previewer**: Modal lightbox supporting high-res image zoom, custom HTML5 video controls, visual audio player, and embedded PDF viewer.
- **Real-Time WebSocket Notifications**: Instant live alerts broadcasted via Socket.io when a user uploads a new asset.
- **OpenAPI / Swagger Documentation**: Interactive API spec available at `/api-docs`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Hooks, Vite), Redux Toolkit, Axios, Socket.io-client, Lucide Icons, CSS3 Glassmorphism System |
| **Backend** | Node.js, Express.js, Multer, Mongoose (MongoDB Atlas), Cloudinary SDK, JWT, Socket.io, Swagger UI |
| **Testing** | Jest, Supertest |

---

## 📁 Repository Structure

```
Assigment-1/
├── backend/                  # Node.js & Express API Service
│   ├── src/
│   │   ├── config/           # DB, Cloudinary & Swagger configurations
│   │   ├── controllers/      # Auth & Media business logic
│   │   ├── middleware/       # JWT auth & Multer file validation
│   │   ├── models/           # Mongoose User & Media schemas
│   │   ├── routes/           # REST API endpoints with Swagger annotations
│   │   ├── services/         # Storage stream & Search ranking algorithms
│   │   └── sockets/          # Socket.io real-time event broadcaster
│   ├── tests/                # Jest integration tests
│   ├── server.js             # Express & HTTP server entrypoint
│   └── package.json
├── frontend/                 # React UI Application
│   ├── src/
│   │   ├── components/       # Navbar, AuthModal, SearchFilters, MediaCard, UploadModal, PreviewModal
│   │   ├── services/         # Axios API & Socket.io client handlers
│   │   ├── store/            # Redux Toolkit auth & media slices
│   │   └── styles/           # Glassmorphism design system CSS
│   └── package.json
└── README.md
```

---

## 🚀 Local Quickstart Guide

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:5000`.
- **Interactive Swagger Docs**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

#### Backend Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/multimedia_db
JWT_ACCESS_SECRET=your_jwt_access_secret_key_32bytes_long!
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_32bytes_long!
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
CLIENT_URL=http://localhost:5173
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend web app will run on `http://localhost:5173`.

---

## 🧪 Running Automated Tests

To run the automated backend Jest integration test suite:

```bash
cd backend
npm test
```

---

## 📖 API Endpoint Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue tokens | ❌ |
| `POST` | `/api/auth/refresh` | Issue new access token via refresh cookie | ❌ |
| `POST` | `/api/auth/logout` | Revoke session & clear refresh cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/api/files/upload` | Upload media file to Cloudinary / storage | Yes |
| `GET` | `/api/files/search` | Search & rank files by query, type, and sort | ❌ |
| `GET` | `/api/files/:id` | Fetch single file details | ❌ |
| `PATCH` | `/api/files/:id/view` | Increment view count for a file | ❌ |
| `DELETE` | `/api/files/:id` | Delete media file from DB & Cloudinary | Yes (Owner) |
