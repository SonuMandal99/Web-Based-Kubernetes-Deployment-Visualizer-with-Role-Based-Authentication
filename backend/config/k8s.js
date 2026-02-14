import dotenv from 'dotenv';

dotenv.config();

let kc = null;
let k8sApps = null;
let k8sCoreApi = null;
let k8sEnabled = false;

const initializeK8s = async () => {
  try {
    let k8s;
    try {
      k8s = await import('@kubernetes/client-node').catch(() => null);
    } catch (e) {
      k8s = null;
    }

    if (!k8s) {
      console.warn('⚠ @kubernetes/client-node not installed. Using mock Kubernetes data.');
      k8sEnabled = false;
      return false;
    }

    kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    k8sApps = kc.makeApiClient(k8s.AppsV1Api);
    k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);

    console.log('✓ Kubernetes Client Initialized Successfully');
    k8sEnabled = true;
    return true;
  } catch (error) {
    console.warn('⚠ Kubernetes integration disabled. Using mock data.');
    console.warn('⚠ Details:', error.message);
    k8sEnabled = false;
    return false;
  }
};

// Mock Kubernetes data for development/testing without actual cluster
const getMockDeployments = (namespace) => {
  return [
    { name: 'frontend-app', namespace, replicas: 3, available: 3, updated: 3, ready: 3, status: 'running', createdAt: new Date() },
    { name: 'backend-api', namespace, replicas: 2, available: 2, updated: 2, ready: 2, status: 'running', createdAt: new Date() }
  ];
};

const getMockPods = (namespace) => {
  return [
    { name: 'frontend-app-abc123', namespace, status: 'Running', nodeName: 'node-1', createdAt: new Date() },
    { name: 'backend-api-def456', namespace, status: 'Running', nodeName: 'node-2', createdAt: new Date() }
  ];
};

const getMockServices = (namespace) => {
  return [
    { name: 'frontend-service', namespace, type: 'ClusterIP', clusterIP: '10.0.0.1', ports: [{ port: 80, targetPort: 3000 }] },
    { name: 'backend-service', namespace, type: 'ClusterIP', clusterIP: '10.0.0.2', ports: [{ port: 5000, targetPort: 5000 }] }
  ];
};

const getMockNamespaces = () => {
  return [
    { name: 'default' },
    { name: 'kube-system' },
    { name: 'kube-public' }
  ];
};

export { initializeK8s, kc, k8sApps, k8sCoreApi, k8sEnabled, getMockDeployments, getMockPods, getMockServices, getMockNamespaces };
