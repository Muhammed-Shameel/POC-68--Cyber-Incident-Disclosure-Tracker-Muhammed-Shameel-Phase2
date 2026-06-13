import { api } from '@/lib/api';
import { IncidentTable } from '@/components/IncidentTable';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getIncidents() {
  try {
    return await api.getIncidents({ limit: 1000 });
  } catch (error) {
    console.error('Failed to load incidents:', error);
    return null;
  }
}

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  if (!incidents) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert size={48} className="text-zinc-700 mb-4" />
        <h2 className="text-xl font-semibold text-white">Data Load Error</h2>
        <p className="text-zinc-500 mt-2">
          Could not fetch the incident list. Please verify the backend service is available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Incident Disclosure Database</h1>
        <p className="text-zinc-400 mt-2">Browse and analyze detailed cyber incident reports</p>
      </div>

      <IncidentTable data={incidents} />
    </div>
  );
}
