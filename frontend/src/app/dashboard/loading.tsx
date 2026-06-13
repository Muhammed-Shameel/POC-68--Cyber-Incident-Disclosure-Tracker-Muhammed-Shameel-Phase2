export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-zinc-900 rounded-lg mb-2"></div>
        <div className="h-4 w-96 bg-zinc-900 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px] bg-zinc-900 border border-zinc-800 rounded-xl"></div>
        <div className="h-[350px] bg-zinc-900 border border-zinc-800 rounded-xl"></div>
      </div>

      <div className="h-[350px] bg-zinc-900 border border-zinc-800 rounded-xl"></div>
    </div>
  );
}
