import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function SummaryCard({ icon: Icon, label, value, color, trend }: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30',
    green: 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30',
    red: 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30',
  };

  return (
    <div className="group bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer animate-fadeIn">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm mb-2 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
          {trend && (
            <p className={`text-xs font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}