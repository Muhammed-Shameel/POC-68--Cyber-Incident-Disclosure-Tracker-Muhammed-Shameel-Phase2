import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function SummaryCard({ title, value, icon: Icon, description }: SummaryCardProps) {
  return (
    <div className="p-6 bg-surface border border-border rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <Icon className="text-text-secondary" size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-text-primary">{value}</span>
        {description && <span className="text-xs text-text-secondary mt-1">{description}</span>}
      </div>
    </div>
  );
}
