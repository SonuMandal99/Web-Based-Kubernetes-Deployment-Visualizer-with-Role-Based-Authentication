import { useState } from 'react';
import { useServices, useNamespaces } from '../hooks/useK8s';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { Network } from 'lucide-react';

export function Services() {
  const [namespace, setNamespace] = useState('default');
  
  const { data: services, isLoading, error } = useServices(namespace);
  const { data: namespaces, isLoading: namespacesLoading } = useNamespaces();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Services</h2>
        <p className="text-slate-400 mt-1">Manage your Kubernetes services</p>
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
          title="Failed to load services"
          message={error}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingState />
      ) : services.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-12 text-center">
          <Network className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
          <p className="text-slate-400">No services in the {namespace} namespace</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <p className="text-slate-400">
              Total: <span className="text-white font-semibold">{services.length}</span> service{services.length !== 1 ? 's' : ''} in <span className="text-blue-400">{namespace}</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Namespace</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Cluster IP</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Ports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {services.map((service) => (
                  <tr key={`${service.namespace}-${service.name}`} className="hover:bg-slate-700/30 transition-all">
                    <td className="px-6 py-4 text-sm text-white font-medium">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">{service.namespace}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30">
                        {service.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{service.clusterIP}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {service.ports && service.ports.length > 0
                        ? service.ports.map((p) => `${p.port}:${p.targetPort}`).join(', ')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
