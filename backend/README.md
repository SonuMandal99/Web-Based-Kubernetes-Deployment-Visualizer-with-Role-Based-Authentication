# Kubernetes Deployment Visualizer - Backend

A production-ready Node.js/Express backend for a web-based Kubernetes deployment visualizer with role-based authentication.

## Features

✨ **Authentication & Authorization**
- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Viewer)
- Password hashing with bcrypt
- Secure token management

🎯 **Kubernetes Integration**
- View deployments, pods, and services
- List namespaces
- Scale deployments (Admin only)
- Real-time cluster interaction using `@kubernetes/client-node`

🔐 **Security**
- CORS protection
- JWT token verification
- Role-based middleware
- Environment variable management
- Secure password storage

🏗️ **Architecture**
- Modular project structure
- Separation of concerns (routes, models, middleware, config)
- Async/await with proper error handling
- Express Router for clean API organization

## Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── k8s.js             # Kubernetes API configuration
├── models/
│   └── User.js            # User schema and methods
├── routes/
│   ├── authRoutes.js      # Authentication endpoints
│   └── k8sRoutes.js       # Kubernetes endpoints
├── middleware/
│   └── authMiddleware.js  # JWT verification and role checking
├── server.js              # Express app setup and server initialization
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud like MongoDB Atlas)
- **Kubernetes cluster** with kubeconfig properly configured
- **Kubeconfig file** at `~/.kube/config` (or custom path in `.env`)

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/k8s-visualizer
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/k8s-visualizer

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Kubernetes Configuration
KUBECONFIG_PATH=~/.kube/config

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Kubernetes Configuration

Ensure your kubeconfig is set up:

```bash
# Check if kubeconfig exists
ls ~/.kube/config

# Or set KUBECONFIG environment variable
export KUBECONFIG=/path/to/your/kubeconfig
```

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "Viewer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Viewer"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <your_jwt_token>
```

### Kubernetes Endpoints

All Kubernetes endpoints require authentication. Pass JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Deployments
```http
GET /api/k8s/deployments?namespace=default
```

**Response:**
```json
{
  "message": "Deployments retrieved successfully",
  "count": 2,
  "data": [
    {
      "name": "nginx-deployment",
      "namespace": "default",
      "replicas": 3,
      "labels": { "app": "nginx" },
      "status": {
        "ready": 3,
        "updated": 3,
        "available": 3
      },
      "containers": [
        {
          "name": "nginx",
          "image": "nginx:latest"
        }
      ],
      "creationTimestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get All Pods
```http
GET /api/k8s/pods?namespace=default
```

#### Get All Services
```http
GET /api/k8s/services?namespace=default
```

#### Get All Namespaces
```http
GET /api/k8s/namespaces
```

#### Scale Deployment (Admin Only)
```http
PUT /api/k8s/scale/deployment-name?namespace=default
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "replicas": 5
}
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "message": "Backend is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "k8sConnected": true
}
```

### API Info

```http
GET /api
```

## Authentication Flow

1. **User Registration/Login** → Receives JWT token
2. **Client stores token** (localStorage/sessionStorage)
3. **Client sends token** in `Authorization: Bearer <token>` header
4. **Server verifies token** with `verifyToken` middleware
5. **Access granted** to protected routes

## Role-Based Access Control

### Viewer Role
- ✅ View deployments, pods, services, namespaces
- ✅ View own profile
- ❌ Cannot scale deployments

### Admin Role
- ✅ All Viewer permissions
- ✅ Scale deployments (PUT /api/k8s/scale/:name)

## Error Handling

The API returns standard HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (e.g., user already exists)
- **500** - Server Error
- **503** - Service Unavailable (Kubernetes not connected)

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- CORS protection
- Environment variable management
- Secure error messages (no sensitive data in responses)

✅ **Recommended for Production:**
- Use HTTPS/TLS for all communications
- Set strong `JWT_SECRET` (use strong random string)
- Use MongoDB Atlas with network whitelisting
- Enable RBAC in Kubernetes cluster
- Rate limiting on authentication endpoints
- Input validation and sanitization
- API request logging and monitoring
- Use secrets management (e.g., HashiCorp Vault)

## Troubleshooting

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB
Solution: 
- Check MONGO_URI in .env
- Ensure MongoDB service is running
- Check network connectivity
```

### Kubernetes Client Error
```
Error: Kubernetes client not initialized
Solution:
- Ensure kubeconfig file exists at ~/.kube/config
- Or set KUBECONFIG environment variable
- Run: kubectl --help to verify kubectl installation
- Check cluster connectivity: kubectl get nodes
```

### Invalid Token Error
```
Solution:
- Token may have expired (default: 7 days)
- User needs to login again
- Check JWT_SECRET matches between registration and verification
```

### CORS Error
```
Solution:
- Check CORS_ORIGIN in .env
- Should match frontend URL (default: http://localhost:5173)
- For development: http://localhost:3000 or http://localhost:5173
```

## Development

### Adding New Routes

1. Create a new router file in `routes/`
2. Import in `server.js`
3. Mount with `app.use('/api/<path>', routerName)`

### Adding New Middleware

1. Create middleware function in `middleware/` folder
2. Use `app.use()` or `router.use()` to apply middleware
3. Middleware applies to all routes mounted after it

### Adding New Models

1. Create schema in `models/` folder
2. Use MongoDB schema validation
3. Add pre/post hooks for business logic

## Testing

### Test the Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/k8s/deployments
```

## Performance Considerations

- **Kubernetes API calls**: Implement caching for read operations
- **Database queries**: Use indexes on email and frequently queried fields
- **JWT verification**: Uses synchronous verification (acceptable for most use cases)
- **Scaling**: Consider adding API rate limiting for production

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Kubernetes client-node documentation
3. Check Mongoose/MongoDB documentation
4. Review Express.js documentation
