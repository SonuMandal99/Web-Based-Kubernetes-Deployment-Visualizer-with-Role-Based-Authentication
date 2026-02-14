import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL: string = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (name: string, email: string, password: string, role: string) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Kubernetes API calls
export const k8sAPI = {
  getDeployments: async (namespace: string = 'default') => {
    const response = await apiClient.get(`/k8s/deployments?namespace=${namespace}`);
    return response.data;
  },

  getPods: async (namespace: string = 'default') => {
    const response = await apiClient.get(`/k8s/pods?namespace=${namespace}`);
    return response.data;
  },

  getServices: async (namespace: string = 'default') => {
    const response = await apiClient.get(`/k8s/services?namespace=${namespace}`);
    return response.data;
  },

  getNamespaces: async () => {
    const response = await apiClient.get('/k8s/namespaces');
    return response.data;
  },

  scaleDeployment: async (name: string, replicas: number, namespace: string = 'default') => {
    const response = await apiClient.put(`/k8s/scale/${name}?namespace=${namespace}`, {
      replicas,
    });
    return response.data;
  },

  createDeployment: async (name: string, image: string, replicas: number, namespace: string = 'default', labels?: Record<string, string>) => {
    const response = await apiClient.post('/k8s/deployments', {
      name,
      image,
      replicas,
      namespace,
      labels,
    });
    return response.data;
  },

  deleteDeployment: async (name: string, namespace: string = 'default') => {
    const response = await apiClient.delete(`/k8s/deployments/${name}?namespace=${namespace}`);
    return response.data;
  },

  getPodLogs: async (podName: string, namespace: string = 'default') => {
    const response = await apiClient.get(`/k8s/logs/${podName}?namespace=${namespace}`);
    return response.data;
  },
};

export default apiClient;
