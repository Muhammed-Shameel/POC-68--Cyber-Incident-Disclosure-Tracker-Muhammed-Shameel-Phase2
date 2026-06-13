import { api } from '@/lib/api';
import {
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Building2,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Incident } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getIncident(id: string): Promise<Incident | null> {
  try {
    return await api.getIncidentById(id);
  } catch {
    return null;
  }
}

export default async function IncidentDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const incident = await getIncident(id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert size={48} className="text-zinc-700 mb-4" />
        <h2 className="text-xl font-semibold text-white">Incident Not Found</h2>
        <p className="text-zinc-500 mt-2">
          The requested disclosure could not be located in our intelligence database.
        </p>
        <Link href="/incidents" className="mt-6 text-blue-500 hover:underline">
          Return to Database
        </Link>
      </div>
    );
  }

  const severityColors: Record<string, string> = {
    CRITICAL: 'text-red-500 bg-red-500/10 border-red-500/20',
    HIGH: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    LOW: 'text-green-500 bg-green-500/10 border-green-500/20',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href="/incidents"
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Database
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-800">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">{incident.company}</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Building2 size={16} />
              {incident.sector}
            </span>
            <span className="text-zinc-700">/</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Calendar size={16} />
              Filing Date: {incident.filing_date}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Risk Score</div>
            <div
              className={cn(
                'text-3xl font-mono font-black',
                incident.risk_score > 7 ? 'text-red-500' : incident.risk_score > 4 ? 'text-orange-500' : 'text-green-500'
              )}
            >
              {incident.risk_score.toFixed(1)}
            </div>
          </div>
          <div
            className={cn(
              'px-4 py-2 rounded-lg border font-bold h-fit',
              severityColors[incident.severity] || 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
            )}
          >
            {incident.severity}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Incident Description</h2>
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Analysis & Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="text-xs text-zinc-500 mb-1">Attack Vector</div>
                <div className="text-white font-medium flex items-center gap-2">
                  <Tag size={16} className="text-blue-500" />
                  {incident.attack_type}
                </div>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="text-xs text-zinc-500 mb-1">Data Source</div>
                <div className="text-white font-medium flex items-center gap-2">
                  <ShieldAlert size={16} className="text-zinc-400" />
                  {incident.source}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-blue-400" />
              Original Source
            </h3>
            <p className="text-sm text-zinc-400">
              This analysis is based on the official SEC 8-K disclosure. View the raw filing for complete legal context.
            </p>
            <a
              href={incident.filing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
            >
              View SEC Filing
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="font-bold text-white mb-4">Quick Stats</h3>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span className="text-zinc-500">Incident Date</span>
                <span className="text-zinc-300">{incident.incident_date || 'Not specified'}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-zinc-500">Industry Sector</span>
                <span className="text-zinc-300">{incident.sector}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-zinc-500">Reporting Entity</span>
                <span className="text-zinc-300">{incident.company}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
