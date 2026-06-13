import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function WhoControlsTheRail() {
  return (
    <section className="border border-zinc-800 p-5 rounded-lg bg-surface">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
        <ShieldCheck size={14} className="text-primary-accent" />
        Who controls the rail
      </div>
      <p className="text-sm text-zinc-300">
        Governance is maintained through SEC regulatory frameworks and independent cybersecurity oversight, ensuring disclosure transparency.
      </p>
    </section>
  );
}
