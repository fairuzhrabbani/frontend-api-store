# 🛍️ Frontend API Store

A modern frontend application for an API-driven store, built with **React and Vite**. This project focuses on frontend development, authentication, and integration with a RESTful backend API.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Backend Integration](#-backend-integration)
- [Running the Application](#-running-the-application)
- [Troubleshooting](#-troubleshooting)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

## 📖 Overview

Frontend API Store is a frontend application designed to interact with a backend API. It provides the foundation for building an API-driven store interface with a focus on maintainable code, reusable components, and a clear separation between frontend and backend responsibilities.

The application is intended for learning, development, and experimentation with modern frontend technologies and REST API integration.

## ✨ Features

- **Authentication Interface** — Login page for user authentication.
- **REST API Integration** — Communicates with the backend using HTTP requests.
- **Component-Based Architecture** — Uses reusable React components.
- **Environment Configuration** — Supports environment variables for API configuration.
- **Development Server** — Fast local development powered by Vite.
- **Cross-Origin Integration** — Supports communication with a separately hosted backend when CORS is configured correctly.

> Note: The feature list should be updated to reflect the functionality currently implemented in the repository.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Frontend development server and build tool |
| JavaScript | Application logic |
| CSS | Styling and layout |
| REST API | Communication with the backend |
| npm | Dependency management |
| Git & GitHub | Version control |

## 🏗️ Project Architecture

The application follows a frontend-to-backend architecture:

```text
Frontend API Store
       |
       v
React Application
       |
       v
HTTP Requests
       |
       v
Backend REST API
       |
       v
Database
```

The frontend is responsible for rendering the user interface and handling user interactions. Authentication, business logic, and data persistence are handled by the backend according to its API implementation.

## 📦 Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/) — LTS version recommended
- npm — Included with Node.js
- [Git](https://git-scm.com/)
- A running instance of the backend API

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fairuzhrabbani/frontend-api-store.git
```

### 2. Navigate to the project directory

```bash
cd frontend-api-store
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and configure the backend API URL.

```env
VITE_API_BASE_URL=http://localhost:3000
```

Adjust the URL to match the backend server and API route configuration.

### 5. Start the development server

```bash
npm run dev
```

### 6. Open the application

Vite typically serves the application at:

```text
http://localhost:5173
```

Open the URL displayed in your terminal.

## ⚙️ Environment Configuration

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for backend API requests | `http://localhost:3000` |

**Important:** Vite exposes variables prefixed with `VITE_` to frontend code. Never store private API keys, database credentials, JWT signing secrets, or other server-side secrets in frontend environment variables.

If your existing application uses a different environment variable name, use the name expected by the current source code.

## 🔗 Backend Integration

This project is designed to communicate with a backend API.

Backend repository: [Backend API Store](https://github.com/fairuzhrabbani/backend-api-kopling-to-cvt)

To run the complete application:

1. Clone and configure the backend repository.
2. Start the backend server.
3. Configure the frontend API base URL.
4. Start the frontend development server.
5. Open the frontend in your browser and test the available functionality.

Make sure the frontend API URL matches the backend's actual routes and port.

### Example API Request

The following example illustrates how a frontend can send a login request. Adjust the endpoint and request payload to match the actual backend implementation.

```javascript
const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "user@example.com",
      password: "your-password",
    }),
  },
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Login failed");
}

console.log(result);
```

This is an illustrative integration example, not a guarantee of the exact endpoint or response format implemented in the repository.

## 🧪 Testing and Validation

The following checks are recommended when validating the application:

- [ ] The frontend starts without build or runtime errors.
- [ ] The login page renders correctly.
- [ ] Login requests reach the backend API.
- [ ] Successful and unsuccessful login responses are handled appropriately.
- [ ] API errors are displayed clearly to the user.
- [ ] CORS is configured for the frontend origin.
- [ ] The application works with the intended backend environment.

## 🛠️ Troubleshooting

### Network Error

**Possible causes:**
- The backend server is not running.
- The frontend API base URL is incorrect.
- The request is blocked by CORS.
- The API endpoint is incorrect.

**Recommended checks:**
1. Verify that the backend is running.
2. Inspect the request URL in the browser's Network tab.
3. Check the backend CORS configuration.
4. Confirm that the endpoint and HTTP method match the backend implementation.

### Route Not Found

If the backend returns a response such as `Route GET /api/auth/login not found`, verify that the frontend is using the correct HTTP method. Login endpoints commonly use `POST`, but the actual backend route definition is authoritative.

### Environment Variable Not Updated

After changing a `.env` file, restart the Vite development server and verify that the variable name matches the one used in the source code.

## 🔮 Future Improvements

Potential enhancements include:

- Product listing and product detail pages
- Search, filtering, and pagination
- Shopping cart functionality
- User registration and logout
- Role-based access control
- Loading states and reusable error handling
- Responsive UI improvements
- Automated frontend and API integration tests
- Production deployment and CI/CD integration

These items are suggestions for future development, not claims about currently implemented features.

## 👨‍💻 Author

**Fairuz Hanif Rabbani**

- GitHub: [@fairuzhrabbani](https://github.com/fairuzhrabbani)
- Frontend Repository: [frontend-api-store](https://github.com/fairuzhrabbani/frontend-api-store)
- Backend Repository: [backend-api-kopling-to-cvt](https://github.com/fairuzhrabbani/backend-api-kopling-to-cvt)

---

⭐ If you find this project useful, feel free to explore the repository and follow its development.

Built with React and Vite.
