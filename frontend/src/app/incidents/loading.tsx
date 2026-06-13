export default function IncidentsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-zinc-900 rounded-lg mb-2"></div>
        <div className="h-4 w-96 bg-zinc-900 rounded-lg"></div>
      </div>

      <div className="flex justify-between">
        <div className="h-10 w-96 bg-zinc-900 rounded-lg"></div>
        <div className="h-6 w-32 bg-zinc-900 rounded-lg"></div>
      </div>

      <div className="h-[600px] bg-zinc-900 border border-zinc-800 rounded-xl"></div>
    </div>
  );
}
