import React from 'react';

type Props = {
  status?: string | null;
  className?: string;
};

const mapStyles: Record<string, string> = {
  new: 'bg-yellow-50 border-yellow-100 text-yellow-700',
  active: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  ongoing: 'bg-blue-50 border-blue-100 text-blue-700',
  completed: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  contract_signed: 'bg-purple-50 border-purple-100 text-purple-700',
};

export const StatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const key = (status || 'unknown').toString().toLowerCase().replace(/\s+/g, '_');
  const styles = mapStyles[key] || 'bg-slate-50 border-slate-100 text-slate-600';

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${styles} ${className}`}
      aria-label={`status-${key}`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-60 inline-block" />
      <span className="whitespace-nowrap">{(status || '').toString().replace(/_/g, ' ').toUpperCase()}</span>
    </span>
  );
};

export default StatusBadge;
