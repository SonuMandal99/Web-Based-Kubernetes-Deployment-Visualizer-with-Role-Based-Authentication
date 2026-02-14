import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Scale, AlertCircle, Plus } from 'lucide-react';
import { LoadingState, TableLoadingSkeleton } from './LoadingState';
import { EmptyState } from './EmptyState';
import { Package } from 'lucide-react';
import { Deployment, useScaleDeployment, useCreateDeployment, useDeleteDeployment } from '../hooks/useK8s';

interface DeploymentTableProps {
  deployments: Deployment[];
  namespace?: string;
  onRefresh?: () => void;
}

export function DeploymentTable({ deployments, namespace = 'default', onRefresh }: DeploymentTableProps) {
  const { user } = useAuth();
  const [scaleDialogOpen, setScaleDialogOpen] = useState<string | null>(null);
  const [scaleValue, setScaleValue] = useState(0);
  const [scaleError, setScaleError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  // Form state for create deployment
  const [createFormData, setCreateFormData] = useState({
    name: '',
    image: '',
    replicas: 1,
  });
  const [createError, setCreateError] = useState<string | null>(null);

  const { scale, isLoading: isScaling } = useScaleDeployment();
  const { create, isLoading: isCreating } = useCreateDeployment();
  const { deleteDeployment, isLoading: isDeleting } = useDeleteDeployment();

  const isAdmin = user?.role === 'Admin';

  const getStatusColor = (available: number, replicas: number) => {
    if (available === 0) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (available < replicas) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getStatusText = (available: number, replicas: number) => {
    if (available === 0) return 'Failed';
    if (available < replicas) return 'Pending';
    return 'Running';
  };

  const handleScale = (deploymentName: string, currentReplicas: number) => {
    setScaleValue(currentReplicas);
    setScaleDialogOpen(deploymentName);
    setScaleError(null);
  };

  const confirmScale = async () => {
    if (!scaleDialogOpen) return;

    try {
      setScaleError(null);
      await scale(scaleDialogOpen, scaleValue, namespace);
      setScaleDialogOpen(null);
      onRefresh?.();
    } catch (err: any) {
      setScaleError(err.message || 'Failed to scale deployment');
    }
  };

  const handleCreateDeployment = async () => {
    if (!createFormData.name.trim() || !createFormData.image.trim()) {
      setCreateError('Please fill in all required fields');
      return;
    }

    try {
      setCreateError(null);
      await create(createFormData.name, createFormData.image, createFormData.replicas, namespace);
      setCreateDialogOpen(false);
      setCreateFormData({ name: '', image: '', replicas: 1 });
      onRefresh?.();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create deployment');
    }
  };

  const handleDeleteDeployment = async (deploymentName: string) => {
    try {
      setDeleteError(null);
      await deleteDeployment(deploymentName, namespace);
      setDeleteConfirmDialog(null);
      onRefresh?.();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete deployment');
    }
  };

  if (deployments.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden">
        <EmptyState
          icon={Package}
          title="No deployments found"
          description="No deployments found in this namespace. Check your Kubernetes cluster connection."
          action={{
            label: 'Refresh',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-0.5 flex items-center gap-2 text-white"
          >
            <Plus className="w-4 h-4" />
            Create Deployment
          </button>
        </div>
      )}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-slate-600 animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Namespace</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Ready</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Available</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                {isAdmin && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {deployments.map((deployment, index) => (
                <tr 
                  key={deployment.name} 
                  className="hover:bg-slate-700/30 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">
                    {deployment.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">
                      {deployment.namespace}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{deployment.status.ready}/{deployment.replicas}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{deployment.status.updated}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{deployment.status.available}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${getStatusColor(
                        deployment.status.available,
                        deployment.replicas
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                      {getStatusText(deployment.status.available, deployment.replicas)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleScale(deployment.name, deployment.replicas)}
                          className="p-2 hover:bg-blue-500/20 active:bg-blue-500/30 rounded-lg transition-all duration-200 text-blue-400 hover:text-blue-300 transform hover:scale-110"
                          title="Scale deployment"
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmDialog(deployment.name)}
                          className="p-2 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-all duration-200 text-red-400 hover:text-red-300 transform hover:scale-110"
                          title="Delete deployment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scale Dialog */}
      {scaleDialogOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setScaleDialogOpen(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fadeIn transform">
              <h3 className="text-xl font-semibold text-white mb-2">Scale Deployment</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Adjust the number of replicas for{' '}
                <span className="text-blue-400 font-medium">
                  {scaleDialogOpen}
                </span>
              </p>

              {/* Error Alert */}
              {scaleError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{scaleError}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Replicas
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scaleValue}
                  onChange={(e) => setScaleValue(parseInt(e.target.value) || 0)}
                  disabled={isScaling}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setScaleDialogOpen(null)}
                  disabled={isScaling}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmScale}
                  disabled={isScaling}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isScaling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Scaling...
                    </>
                  ) : (
                    'Scale Deployment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Deployment Dialog */}
      {createDialogOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setCreateDialogOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fadeIn transform">
              <h3 className="text-xl font-semibold text-white mb-2">Create Deployment</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Create a new Kubernetes deployment in <span className="text-blue-400 font-medium">{namespace}</span>
              </p>

              {/* Error Alert */}
              {createError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{createError}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deployment Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="my-app"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    disabled={isCreating}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Container Image <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="nginx:latest"
                    value={createFormData.image}
                    onChange={(e) => setCreateFormData({ ...createFormData, image: e.target.value })}
                    disabled={isCreating}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Replicas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createFormData.replicas}
                    onChange={(e) => setCreateFormData({ ...createFormData, replicas: parseInt(e.target.value) || 1 })}
                    disabled={isCreating}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeployment}
                  disabled={isCreating}
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Deployment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmDialog && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setDeleteConfirmDialog(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fadeIn transform">
              <h3 className="text-xl font-semibold text-white mb-2">Delete Deployment</h3>
              <p className="text-slate-400 mb-2 text-sm">
                Are you sure you want to delete{' '}
                <span className="text-red-400 font-medium">
                  {deleteConfirmDialog}
                </span>
                ?
              </p>
              <p className="text-slate-500 mb-6 text-sm">This action cannot be undone.</p>

              {/* Error Alert */}
              {deleteError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{deleteError}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmDialog(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirmDialog && handleDeleteDeployment(deleteConfirmDialog)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Deployment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}