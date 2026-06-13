'use client';

import React from 'react';
import { AlertTriangle, ArrowUpRight } from 'lucide-react';
import { HighRiskIncident } from '../types';
import Link from 'next/link';

interface HighRiskIncidentsProps {
  incidents: HighRiskIncident[];
}

const HighRiskIncidents: React.FC<HighRiskIncidentsProps> = ({ incidents }) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary-accent/10 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-secondary-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">High Risk Ranking</h2>
        </div>
        <span className="text-text-secondary text-sm">Top 10 by Risk Score</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 font-semibold text-text-secondary text-sm">Company</th>
              <th className="pb-3 font-semibold text-text-secondary text-sm">Sector</th>
              <th className="pb-3 font-semibold text-text-secondary text-sm text-center">Severity</th>
              <th className="pb-3 font-semibold text-text-secondary text-sm text-right">Risk Score</th>
              <th className="pb-3 font-semibold text-text-secondary text-sm text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {incidents.map((incident) => (
              <tr key={incident.incident_id} className="group hover:bg-secondary-surface/30 transition-colors">
                <td className="py-4">
                  <span className="text-text-primary font-medium">{incident.company}</span>
                </td>
                <td className="py-4">
                  <span className="text-text-secondary text-sm">{incident.sector}</span>
                </td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    incident.severity === 'Critical' ? 'bg-secondary-accent/20 text-secondary-accent' :
                    incident.severity === 'High' ? 'bg-primary-accent/20 text-primary-accent' :
                    'bg-primary-accent/10 text-primary-accent'
                  }`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className={`font-bold ${
                    incident.risk_score >= 8 ? 'text-secondary-accent' :
                    incident.risk_score >= 6 ? 'text-primary-accent' :
                    'text-text-secondary'
                  }`}>
                    {incident.risk_score.toFixed(1)}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link 
                    href={`/incidents/${incident.incident_id}`}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-surface rounded-lg transition-all inline-block"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 

export default HighRiskIncidents;