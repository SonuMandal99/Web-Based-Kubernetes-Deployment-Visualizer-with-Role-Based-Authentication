import { useState, useEffect } from 'react';
import { k8sAPI } from '../services/api';


export interface Deployment {
  name: string;
  namespace: string;
  replicas: number;
  labels?: Record<string, string>;
  creationTimestamp: string;
  status: {
    ready: number;
    updated: number;
    available: number;
  };
  containers?: Array<{
    name: string;
    image: string;
  }>;
}

export interface Pod {
  name: string;
  namespace: string;
  status: string;
  labels?: Record<string, string>;
  creationTimestamp: string;
  containerStatuses?: Array<{
    name: string;
    ready: boolean;
    restartCount: number;
  }>;
  nodeName?: string;
}

export interface Service {
  name: string;
  namespace: string;
  type: string;
  clusterIP: string;
  ports?: Array<{
    name: string;
    port: number;
    targetPort: string | number;
    protocol: string;
  }>;
  selector?: Record<string, string>;
  creationTimestamp: string;
}

export interface K8sNamespace {
  name: string;
  status: string;
  creationTimestamp: string;
}

interface UseK8sReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDeployments(namespace: string = 'default'): UseK8sReturn<Deployment> {
  const [data, setData] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.getDeployments(namespace);
      setData(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch deployments';
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [namespace]);

  return { data, isLoading, error, refetch: fetchData };
}

export function usePods(namespace: string = 'default'): UseK8sReturn<Pod> {
  const [data, setData] = useState<Pod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.getPods(namespace);
      setData(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch pods';
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [namespace]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useServices(namespace: string = 'default'): UseK8sReturn<Service> {
  const [data, setData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.getServices(namespace);
      setData(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch services';
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [namespace]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useNamespaces(): UseK8sReturn<K8sNamespace> {
  const [data, setData] = useState<K8sNamespace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.getNamespaces();
      setData(response.data || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch namespaces';
      setError(errorMessage);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
}

export function useScaleDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scale = async (name: string, replicas: number, namespace: string = 'default') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.scaleDeployment(name, replicas, namespace);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to scale deployment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { scale, isLoading, error };
}

export function useCreateDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (name: string, image: string, replicas: number, namespace: string = 'default', labels?: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.createDeployment(name, image, replicas, namespace, labels);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create deployment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}

export function useDeleteDeployment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDeployment = async (name: string, namespace: string = 'default') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.deleteDeployment(name, namespace);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete deployment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteDeployment, isLoading, error };
}

export function usePodLogs(podName: string, namespace: string = 'default') {
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await k8sAPI.getPodLogs(podName, namespace);
      setLogs(response.data || '');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch logs';
      setError(errorMessage);
      setLogs('');
    } finally {
      setIsLoading(false);
    }
  };

  return { logs, isLoading, error, fetchLogs };
}
