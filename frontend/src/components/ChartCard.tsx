interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={`p-6 bg-surface border border-border rounded-xl ${className}`}>
      <h3 className="text-lg font-semibold text-text-primary mb-6">{title}</h3>
      <div className="w-full h-[350px] min-h-[350px]">
        {children}
      </div>
    </div>
  );
}
