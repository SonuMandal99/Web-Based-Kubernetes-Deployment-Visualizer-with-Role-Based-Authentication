import { useState } from 'react';
import { useDeployments, useNamespaces } from '../hooks/useK8s';
import { useAuth } from '../context/AuthContext';
import { DeploymentTable } from '../components/DeploymentTable';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';

export function Deployments() {
  const { user } = useAuth();
  const [namespace, setNamespace] = useState('default');
  
  const { data: deployments, isLoading, error, refetch } = useDeployments(namespace);
  const { data: namespaces, isLoading: namespacesLoading } = useNamespaces();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Deployments</h2>
        <p className="text-slate-400 mt-1">Manage your Kubernetes deployments</p>
      </div>

      {/* Namespace Selector */}
      <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Select Namespace
        </label>
        {namespacesLoading ? (
          <div className="h-10 bg-slate-700 rounded-lg animate-pulse" />
        ) : (
          <select
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {namespaces.map((ns) => (
              <option key={ns.name} value={ns.name}>
                {ns.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error State */}
      {error && (
        <ErrorState
          title="Failed to load deployments"
          message={error}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-slate-400">
              Total: <span className="text-white font-semibold">{deployments.length}</span> deployment{deployments.length !== 1 ? 's' : ''} in <span className="text-blue-400">{namespace}</span>
            </p>
          </div>
          <DeploymentTable deployments={deployments} namespace={namespace} onRefresh={refetch} />
        </div>
      )}
    </div>
  );
}
