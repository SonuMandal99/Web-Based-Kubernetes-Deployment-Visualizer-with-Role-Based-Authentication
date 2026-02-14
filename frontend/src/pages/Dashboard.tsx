import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Box, Network, Activity } from 'lucide-react';
import { SummaryCard } from '../components/SummaryCard';
import { DeploymentTable } from '../components/DeploymentTable';
import { useDeployments, usePods, useServices, useNamespaces } from '../hooks/useK8s';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';

export function Dashboard() {
  const { user } = useAuth();
  const [namespace, setNamespace] = useState('default');
  
  // Fetch K8s data
  const { data: deployments, isLoading: deploymentsLoading, error: deploymentsError } = useDeployments(namespace);
  const { data: pods, isLoading: podsLoading, error: podsError } = usePods(namespace);
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices(namespace);
  const { data: namespaces, isLoading: namespacesLoading, error: namespacesError } = useNamespaces();

  // Calculate summary data
  const summaryData = [
    {
      icon: Package,
      label: 'Total Deployments',
      value: deployments.length.toString(),
      color: 'blue',
      trend: { value: 'Current namespace', isPositive: true },
    },
    {
      icon: Box,
      label: 'Total Pods',
      value: pods.length.toString(),
      color: 'purple',
      trend: { value: 'Current namespace', isPositive: true },
    },
    {
      icon: Network,
      label: 'Total Services',
      value: services.length.toString(),
      color: 'green',
      trend: { value: 'Current namespace', isPositive: true },
    },
    {
      icon: Activity,
      label: 'Status',
      value: deploymentsError || podsError ? 'Warning' : 'Healthy',
      color: deploymentsError || podsError ? 'orange' : 'green',
    },
  ];

  const isLoading = deploymentsLoading || podsLoading || servicesLoading;
  const hasError = deploymentsError || podsError || servicesError;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="animate-fadeIn">
        <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-slate-400 mt-2 text-lg">
          Welcome back, <span className="text-white font-medium">{user?.name}</span> · <span className="text-blue-400">{user?.role}</span>
        </p>
      </div>

      {/* Namespace Selector */}
      <div className="animate-fadeIn">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Kubernetes Namespace
        </label>
        {namespacesLoading ? (
          <div className="h-10 bg-slate-800/50 rounded-lg animate-pulse" />
        ) : namespacesError ? (
          <div className="h-10 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center px-3">
            <p className="text-red-400 text-sm">{namespacesError}</p>
          </div>
        ) : (
          <select
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="w-full max-w-xs bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
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
      {hasError && (
        <div className="animate-fadeIn">
          <ErrorState
            title="Failed to load Kubernetes data"
            message={deploymentsError || podsError || servicesError || 'Unable to connect to cluster'}
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((data, index) => (
          <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
            {isLoading ? (
              <div className="h-40 bg-slate-800/50 rounded-xl animate-pulse" />
            ) : (
              <SummaryCard {...data} />
            )}
          </div>
        ))}
      </div>

      {/* Deployment Table */}
      <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-white">Recent Deployments</h3>
            <p className="text-slate-400 mt-1">Monitor and manage your active deployments</p>
          </div>
          {user?.role === 'Admin' && (
            <button className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-0.5 flex items-center gap-2">
              <Package className="w-4 h-4" />
              New Deployment
            </button>
          )}
        </div>
        {isLoading ? (
          <LoadingState />
        ) : hasError ? (
          <ErrorState title="Failed to load deployments" message={deploymentsError || 'Unknown error'} />
        ) : (
          <DeploymentTable deployments={deployments} namespace={namespace} />
        )}
      </div>
    </div>
  );
}