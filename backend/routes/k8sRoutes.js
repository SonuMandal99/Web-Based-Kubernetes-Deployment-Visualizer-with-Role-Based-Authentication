import express from 'express';
import { verifyToken, requireAdmin, requireViewer } from '../middleware/authMiddleware.js';
import { k8sApps, k8sCoreApi, k8sEnabled, getMockDeployments, getMockPods, getMockServices, getMockNamespaces } from '../config/k8s.js';

const router = express.Router();

/**
 * @route   GET /api/k8s/deployments
 * @desc    Get all deployments from Kubernetes cluster
 * @access  Public (with optional auth for real K8s)
 */
router.get('/deployments', async (req, res) => {
  try {
    const namespace = req.query.namespace || 'default';
    let deployments = [];
    
    if (!k8sEnabled || !k8sApps) {
      // Return mock data when K8s is not available
      deployments = getMockDeployments(namespace);
    } else {
      const response = await k8sApps.listNamespacedDeployment(namespace);

      deployments = response.body.items.map((deployment) => ({
        name: deployment.metadata.name,
        namespace: deployment.metadata.namespace,
        replicas: deployment.spec.replicas,
        labels: deployment.metadata.labels,
        creationTimestamp: deployment.metadata.creationTimestamp,
        status: {
          ready: deployment.status.readyReplicas || 0,
          updated: deployment.status.updatedReplicas || 0,
          available: deployment.status.availableReplicas || 0,
        },
        containers: deployment.spec.template.spec.containers.map((container) => ({
          name: container.name,
          image: container.image,
        })),
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Deployments retrieved successfully',
      count: deployments.length,
      data: deployments,
    });
  } catch (error) {
    console.error('Error fetching deployments:', error.message);
    // Return mock data even on error
    const deployments = getMockDeployments(req.query.namespace || 'default');
    res.status(200).json({
      success: true,
      message: 'Deployments retrieved (mock data)',
      count: deployments.length,
      data: deployments,
    });
  }
});

/**
 * @route   GET /api/k8s/pods
 * @desc    Get all pods from Kubernetes cluster
 * @access  Public
 */
router.get('/pods', async (req, res) => {
  try {
    const namespace = req.query.namespace || 'default';
    let pods = [];
    
    if (!k8sEnabled || !k8sCoreApi) {
      // Return mock data when K8s is not available
      pods = getMockPods(namespace);
    } else {
      const response = await k8sCoreApi.listNamespacedPod(namespace);

      pods = response.body.items.map((pod) => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        labels: pod.metadata.labels,
        creationTimestamp: pod.metadata.creationTimestamp,
        containerStatuses: pod.status.containerStatuses?.map((container) => ({
          name: container.name,
          ready: container.ready,
          restartCount: container.restartCount,
        })) || [],
        nodeName: pod.spec.nodeName,
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Pods retrieved successfully',
      count: pods.length,
      data: pods,
    });
  } catch (error) {
    console.error('Error fetching pods:', error.message);
    // Fallback to mock data
    const pods = getMockPods(req.query.namespace || 'default');
    res.status(200).json({
      success: true,
      message: 'Pods retrieved (mock data)',
      count: pods.length,
      data: pods,
    });
  }
});

/**
 * @route   GET /api/k8s/services
 * @desc    Get all services from Kubernetes cluster
 * @access  Public
 */
router.get('/services', async (req, res) => {
  try {
    const namespace = req.query.namespace || 'default';
    let services = [];
    
    if (!k8sEnabled || !k8sCoreApi) {
      // Return mock data when K8s is not available
      services = getMockServices(namespace);
    } else {
      const response = await k8sCoreApi.listNamespacedService(namespace);

      services = response.body.items.map((service) => ({
        name: service.metadata.name,
        namespace: service.metadata.namespace,
        type: service.spec.type,
        clusterIP: service.spec.clusterIP,
        ports: service.spec.ports?.map((port) => ({
          name: port.name,
          port: port.port,
          targetPort: port.targetPort,
          protocol: port.protocol,
        })) || [],
        selector: service.spec.selector,
        creationTimestamp: service.metadata.creationTimestamp,
      }));
    }

    res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    // Fallback to mock data
    const services = getMockServices(req.query.namespace || 'default');
    res.status(200).json({
      success: true,
      message: 'Services retrieved (mock data)',
      count: services.length,
      data: services,
    });
  }
});

/**
 * @route   PUT /api/k8s/scale/:name
 * @desc    Scale a deployment (Admin only)
 * @access  Private (Admin)
 */
router.put('/scale/:name', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.params;
    const { replicas } = req.body;
    const namespace = req.query.namespace || 'default';

    // Validation
    if (replicas === undefined || replicas === null) {
      return res.status(400).json({
        message: 'Please provide the desired number of replicas',
      });
    }

    if (!Number.isInteger(replicas) || replicas < 0) {
      return res.status(400).json({
        message: 'Replicas must be a non-negative integer',
      });
    }

    if (!k8sEnabled || !k8sApps) {
      // Mock response
      return res.status(200).json({
        message: `Deployment '${name}' scaled to ${replicas} replicas successfully (simulated)`,
        deployment: {
          name,
          namespace,
          replicas,
          status: {
            ready: replicas,
            updated: replicas,
            available: replicas,
          },
        },
      });
    }

    // Get current deployment
    const deployment = await k8sApps.readNamespacedDeployment(name, namespace);

    // Update the spec replicas
    deployment.body.spec.replicas = replicas;

    // Patch the deployment
    const patchBody = {
      spec: {
        replicas: replicas,
      },
    };

    const response = await k8sApps.patchNamespacedDeployment(
      name,
      namespace,
      patchBody,
      undefined,
      undefined,
      undefined,
      undefined,
      { headers: { 'Content-Type': 'application/merge-patch+json' } }
    );

    res.status(200).json({
      message: `Deployment '${name}' scaled to ${replicas} replicas successfully`,
      deployment: {
        name: response.body.metadata.name,
        namespace: response.body.metadata.namespace,
        replicas: response.body.spec.replicas,
        status: {
          ready: response.body.status.readyReplicas || 0,
          updated: response.body.status.updatedReplicas || 0,
          available: response.body.status.availableReplicas || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error scaling deployment:', error.message);

    if (error.statusCode === 404) {
      return res.status(404).json({
        message: 'Deployment not found',
        error: error.message,
      });
    }

    res.status(500).json({
      message: 'Failed to scale deployment',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/k8s/namespaces
 * @desc    Get all namespaces from Kubernetes cluster
 * @access  Public
 */
router.get('/namespaces', async (req, res) => {
  try {
    if (!k8sEnabled || !k8sCoreApi) {
      // Return mock data
      const namespaces = getMockNamespaces();
      return res.status(200).json({
        message: 'Namespaces retrieved successfully (mock data)',
        count: namespaces.length,
        data: namespaces,
      });
    }

    const response = await k8sCoreApi.listNamespace();

    const namespaces = response.body.items.map((ns) => ({
      name: ns.metadata.name,
      status: ns.status.phase,
      creationTimestamp: ns.metadata.creationTimestamp,
    }));

    res.status(200).json({
      success: true,
      message: 'Namespaces retrieved successfully',
      count: namespaces.length,
      data: namespaces,
    });
  } catch (error) {
    console.error('Error fetching namespaces:', error.message);
    // Fallback to mock data
    const namespaces = getMockNamespaces();
    res.status(200).json({
      success: true,
      message: 'Namespaces retrieved (mock data)',
      count: namespaces.length,
      data: namespaces,
    });
  }
});

/**
 * @route   POST /api/k8s/deployments
 * @desc    Create a new Kubernetes deployment
 * @access  Private (Admin only)
 */
router.post('/deployments', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, image, replicas = 1, namespace = 'default', labels = {} } = req.body;

    // Validation
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Deployment name and image are required',
      });
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Deployment name must be a non-empty string',
      });
    }

    if (typeof image !== 'string' || image.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Container image must be a non-empty string',
      });
    }

    if (!Number.isInteger(replicas) || replicas < 1) {
      return res.status(400).json({
        success: false,
        message: 'Replicas must be a positive integer',
      });
    }

    // If K8s is not available, return mock response
    if (!k8sEnabled || !k8sApps) {
      console.log(`[MOCK] Creating deployment '${name}' with ${replicas} replicas in namespace '${namespace}'`);
      return res.status(201).json({
        success: true,
        message: 'Deployment created successfully (simulated)',
        data: {
          name,
          namespace,
          replicas,
          image,
          labels,
          status: {
            ready: replicas,
            updated: replicas,
            available: replicas,
          },
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Create deployment manifest
    const deploymentManifest = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: name.toLowerCase(),
        namespace: namespace,
        labels: {
          app: name.toLowerCase(),
          ...labels,
        },
      },
      spec: {
        replicas: replicas,
        selector: {
          matchLabels: {
            app: name.toLowerCase(),
          },
        },
        template: {
          metadata: {
            labels: {
              app: name.toLowerCase(),
              ...labels,
            },
          },
          spec: {
            containers: [
              {
                name: name.toLowerCase(),
                image: image,
                ports: [
                  {
                    containerPort: 8080,
                  },
                ],
                resources: {
                  requests: {
                    cpu: '100m',
                    memory: '128Mi',
                  },
                  limits: {
                    cpu: '500m',
                    memory: '512Mi',
                  },
                },
              },
            ],
          },
        },
      },
    };

    // Create the deployment
    const response = await k8sApps.createNamespacedDeployment(namespace, deploymentManifest);

    res.status(201).json({
      success: true,
      message: 'Deployment created successfully',
      data: {
        name: response.body.metadata.name,
        namespace: response.body.metadata.namespace,
        replicas: response.body.spec.replicas,
        image: image,
        labels: response.body.metadata.labels,
        status: {
          ready: response.body.status?.readyReplicas || 0,
          updated: response.body.status?.updatedReplicas || 0,
          available: response.body.status?.availableReplicas || 0,
        },
        createdAt: response.body.metadata.creationTimestamp,
      },
    });
  } catch (error) {
    console.error('Error creating deployment:', error.message);

    // Handle specific K8s errors
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: `Deployment already exists with the name '${req.body.name}'`,
        error: error.message,
      });
    }

    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: `Namespace '${req.body.namespace || 'default'}' not found`,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create deployment',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/k8s/logs/:podName
 * @desc    Get logs for a pod
 * @access  Public
 */
router.get('/logs/:podName', async (req, res) => {
  try {
    const { podName } = req.params;
    const namespace = req.query.namespace || 'default';

    if (!k8sEnabled || !k8sCoreApi) {
      return res.status(200).json({
        success: true,
        message: 'Logs (mock)',
        data: `Mock logs for pod ${podName} in namespace ${namespace}`,
      });
    }

    // Read pod logs
    const logs = await k8sCoreApi.readNamespacedPodLog(podName, namespace);

    res.status(200).json({
      success: true,
      message: 'Logs fetched successfully',
      data: logs.body || logs,
    });
  } catch (error) {
    console.error('Error fetching pod logs:', error.message || error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/k8s/deployments/:name
 * @desc    Delete a deployment (Admin only)
 * @access  Private (Admin)
 */
router.delete('/deployments/:name', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.params;
    const namespace = req.query.namespace || 'default';

    if (!k8sEnabled || !k8sApps) {
      // Simulate deletion
      return res.status(200).json({
        success: true,
        message: `Deployment '${name}' deleted (simulated)`,
      });
    }

    const response = await k8sApps.deleteNamespacedDeployment(name, namespace);

    res.status(200).json({
      success: true,
      message: `Deployment '${name}' deleted successfully`,
      data: response.body,
    });
  } catch (error) {
    console.error('Error deleting deployment:', error.message || error);
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: 'Deployment not found', error: error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to delete deployment', error: error.message });
  }
});

export default router;
