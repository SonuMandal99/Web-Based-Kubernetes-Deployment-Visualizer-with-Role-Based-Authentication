import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initializeK8s } from './config/k8s.js';
import authRoutes from './routes/authRoutes.js';
import k8sRoutes from './routes/k8sRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let k8sInitialized = false;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Initialize Database and Kubernetes
(async () => {
  try {
    await connectDB();
    console.log('✓ Database initialized');
  } catch (error) {
    console.error('✗ Failed to initialize database:', error.message);
  }

  // Initialize Kubernetes Client
  try {
    k8sInitialized = await initializeK8s();
    if (k8sInitialized) {
      console.log('✓ Kubernetes integration ready');
    } else {
      console.warn('⚠ Kubernetes integration not available - using mock data');
    }
  } catch (error) {
    console.warn('⚠ Kubernetes initialization error:', error.message);
    k8sInitialized = false;
  }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/k8s', k8sRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    k8sConnected: k8sInitialized,
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Kubernetes Deployment Visualizer Backend',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getProfile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout',
      },
      kubernetes: {
        deployments: 'GET /api/k8s/deployments',
        pods: 'GET /api/k8s/pods',
        services: 'GET /api/k8s/services',
        namespaces: 'GET /api/k8s/namespaces',
        scaleDeployment: 'PUT /api/k8s/scale/:name (Admin only)',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('✗ Error:', error);
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error : {},
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n================================`);
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
  console.log(`✓ Health: http://localhost:${PORT}/health`);
  console.log(`================================\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Server shutting down gracefully...');
  process.exit(0);
});

export default app;
