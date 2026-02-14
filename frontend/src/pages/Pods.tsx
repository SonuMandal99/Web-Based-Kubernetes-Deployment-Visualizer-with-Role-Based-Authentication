import { useState } from 'react';
import { usePods, useNamespaces, usePodLogs } from '../hooks/useK8s';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { Box, FileText } from 'lucide-react';

export function Pods() {
  const [namespace, setNamespace] = useState('default');
  const [logsDialogOpen, setLogsDialogOpen] = useState<string | null>(null);
  
  const { data: pods, isLoading, error } = usePods(namespace);
  const { data: namespaces, isLoading: namespacesLoading } = useNamespaces();
  const { logs: podLogs, isLoading: logsLoading, error: logsError, fetchLogs } = usePodLogs(logsDialogOpen || '', namespace);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const handleViewLogs = (podName: string) => {
    setLogsDialogOpen(podName);
    setTimeout(() => fetchLogs(), 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Pods</h2>
        <p className="text-slate-400 mt-1">View and manage your Kubernetes pods</p>
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
          title="Failed to load pods"
          message={error}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingState />
      ) : pods.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-12 text-center">
          <Box className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No pods found</h3>
          <p className="text-slate-400">No pods in the {namespace} namespace</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <p className="text-slate-400">
              Total: <span className="text-white font-semibold">{pods.length}</span> pod{pods.length !== 1 ? 's' : ''} in <span className="text-blue-400">{namespace}</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Namespace</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Node</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {pods.map((pod, index) => (
                  <tr key={`${pod.namespace}-${pod.name}`} className="hover:bg-slate-700/30 transition-all group">
                    <td className="px-6 py-4 text-sm text-white font-medium group-hover:text-blue-400 transition-colors">{pod.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">{pod.namespace}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pod.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                        {pod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{pod.nodeName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(pod.creationTimestamp).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleViewLogs(pod.name)}
                          className="p-2 hover:bg-blue-500/20 active:bg-blue-500/30 rounded-lg transition-all duration-200 text-blue-400 hover:text-blue-300 transform hover:scale-110"
                          title="View logs"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Logs Dialog */}
      {logsDialogOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setLogsDialogOpen(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-2xl shadow-2xl animate-fadeIn transform max-h-[90vh] overflow-auto">
              <h3 className="text-xl font-semibold text-white mb-2">Pod Logs</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Logs for pod <span className="text-blue-400 font-medium">{logsDialogOpen}</span> in namespace <span className="text-blue-400 font-medium">{namespace}</span>
              </p>

              {/* Loading State */}
              {logsLoading && (
                <div className="mb-6 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading logs...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {logsError && !logsLoading && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{logsError}</p>
                </div>
              )}

              {/* Logs Display */}
              {!logsLoading && podLogs && (
                <div className="mb-6 p-4 bg-slate-900/50 border border-slate-600 rounded-lg overflow-auto max-h-96">
                  <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap break-all">
                    {podLogs}
                  </pre>
                </div>
              )}

              {!logsLoading && !podLogs && !logsError && (
                <div className="mb-6 p-4 bg-slate-700/20 border border-slate-600 rounded-lg text-center">
                  <p className="text-slate-400 text-sm">No logs available for this pod</p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setLogsDialogOpen(null)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg transition-all duration-200 font-medium transform hover:-translate-y-0.5"
                >
                  Close
                </button>
                {podLogs && (
                  <button
                    onClick={() => {
                      const element = document.createElement('a');
                      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(podLogs));
                      element.setAttribute('download', `${logsDialogOpen}_logs.txt`);
                      element.style.display = 'none';
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all duration-200 font-medium hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5"
                  >
                    Download Logs
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
