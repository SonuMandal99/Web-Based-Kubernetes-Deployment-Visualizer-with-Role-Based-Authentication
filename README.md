# Kubernetes Deployment Visualizer
## Overview

**Kubernetes Deployment Visualizer** is a modern web-based tool designed for visualizing and managing Kubernetes resources. It features:

- 🎯 **Real-time Kubernetes Resource Monitoring** — View deployments, pods, services, and namespaces with live data from your cluster
- 🔐 **Role-Based Access Control** — Admin and Viewer roles with granular permissions
- 📊 **Interactive Dashboard** — Summary cards, deployment tables, and pod logs viewer
- 🌐 **No Cluster Required** — Built-in mock mode for offline development and demos
- ⚡ **Modern Tech Stack** — React + TypeScript + Vite frontend, Node.js + Express backend, MongoDB database

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Deployments View** | List all deployments per namespace with replica counts and status |
| **Pods Management** | View pod details, logs, and status monitoring |
| **Services Discovery** | List and manage Kubernetes services |
| **Namespace Switching** | Easy switching between different Kubernetes namespaces |
| **Deployment Scaling** | Admin users can scale deployments directly from the UI |
| **User Authentication** | Secure JWT-based authentication with registration/login |
| **Role-Based Access** | Admin (full control) and Viewer (read-only) roles |

### Architecture Highlights

- **Secure**: JWT authentication, bcrypt password hashing, CORS protection, role-based middleware
- **Flexible**: Works with real Kubernetes clusters or in mock mode for development
- **Scalable**: Express backend with MongoDB for user persistence
- **Full-Stack TypeScript**: Type-safe frontend and JavaScript backend
- **Modern UI**: React with Tailwind CSS, Radix UI components, responsive design

---

## Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **Radix UI** — Unstyled, accessible components
- **React Router** — Client-side routing
- **Axios** — HTTP client

### Backend
- **Node.js** — JavaScript runtime
- **Express** — Web framework
- **MongoDB** — User database
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing
- **@kubernetes/client-node** — Kubernetes API client (optional)

---

## Repository Layout

```
K8s Deployment Visualizer UI/
├── frontend/                   # React + TypeScript UI
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context (auth)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API client
│   │   └── styles/            # Global styles
│   ├── package.json
│   └── README.md
├── backend/                    # Express API server
│   ├── routes/                # API routes
│   ├── config/                # Database & K8s config
│   ├── middleware/            # Auth middleware
│   ├── models/                # MongoDB schemas
│   ├── server.js              # Entry point
│   ├── package.json
│   ├── .env.example           # Environment template
│   └── README.md
├── .gitignore
├── README.md                  # This file
└── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js** v16+ and npm ([download](https://nodejs.org/))
- **MongoDB** (local or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)) — *optional for mock mode*
- **Git**

### 1. Clone & Setup



# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Backend

```bash
cd backend

# Create .env from template
cp .env.example .env

# Edit .env with your settings:
# - MONGO_URI: your MongoDB connection string
# - JWT_SECRET: choose a strong secret
# - CORS_ORIGIN: your frontend URL
# - KUBECONFIG_PATH: (optional) path to kubeconfig

npm run dev
```

The backend will start on `http://localhost:5000`  
Health check: `curl http://localhost:5000/health`

### 3. Configure Frontend

```bash
cd frontend

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

Open the URL shown in terminal (typically `http://localhost:5173`)

---

## Configuration

### Backend Environment Variables

Create `backend/.env` from `backend/.env.example`:

```dotenv
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/k8s-visualizer

# JWT
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d

# Kubernetes (optional)
KUBECONFIG_PATH=~/.kube/config

# CORS (comma-separated)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

---

## API Reference

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "Viewer"  // or "Admin"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Kubernetes Endpoints

```http
GET /api/k8s/namespaces
Authorization: Bearer <jwt_token>

GET /api/k8s/deployments?namespace=default
Authorization: Bearer <jwt_token>

GET /api/k8s/pods?namespace=default
Authorization: Bearer <jwt_token>

GET /api/k8s/services?namespace=default
Authorization: Bearer <jwt_token>

PUT /api/k8s/scale/deployment-name?namespace=default
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "replicas": 3
}
```

See [backend/README.md](backend/README.md) for detailed examples and error responses.

---

## Usage Guide

### 1. Create an Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securePassword",
    "role": "Admin"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securePassword"
  }'
```

Response includes JWT token. Store it (localStorage in browser).

### 3. Use in UI

1. Visit `http://localhost:5173`
2. Register or login with your account
3. View dashbord with Deployment, Pod, and Service summaries
4. Switch namespaces via dropdown
5. View detailed tables and logs
6. (Admin only) Scale deployments with the modal


### CORS Errors

**Problem**: Frontend can't reach backend  
**Solution**: Verify `CORS_ORIGIN` in `backend/.env` matches your frontend URL

```dotenv
CORS_ORIGIN=http://localhost:5173
```



### Frontend Build Errors

**Problem**: Tailwind CSS errors  
**Solution**: Should be fixed. If persists:

```bash
cd frontend
npm install
npm run build
```

### Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "message": "Backend is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "k8sConnected": true
}
```

---

## Development

### Project Structure

- **`frontend/`** — React/TypeScript application with routing, context API for auth, and component library
- **`backend/`** — Express API with middleware, routes, models, and K8s integration
- **`.env.example`** — Template for environment variables

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend (already production-ready)
cd backend
npm install --production

# Frontend
cd frontend
npm run build
# Creates optimized build in `build/` folder
```

---

## Deployment

This project is designed for **local development**. For production deployment:

1. **Backend**: Deploy to any Node.js hosting (Heroku, AWS, GCP, Azure)
2. **Frontend**: Build and serve static files (Vercel, Netlify, AWS S3 + CloudFront)
3. **Database**: Use managed MongoDB (Atlas, AWS DocumentDB, Azure CosmosDB)
4. **Kubernetes**: Point to your production cluster via kubeconfig

---

## Role-Based Access Control

| Action | Viewer | Admin |
|--------|--------|-------|
| View Deployments | ✅ | ✅ |
| View Pods | ✅ | ✅ |
| View Services | ✅ | ✅ |
| View Namespaces | ✅ | ✅ |
| Scale Deployments | ❌ | ✅ |
| Create Deployments | ❌ | ✅ |

---

## Known Limitations

- **Mock Mode Only**: Without a real Kubernetes cluster, all K8s data is simulated
- **Single Cluster**: Designed to connect to one Kubernetes cluster at a time
- **Browser Storage**: JWT tokens stored in localStorage (not ideal for high-security apps)
- **No Real-Time Updates**: Uses polling, not WebSocket for live updates

---




 
