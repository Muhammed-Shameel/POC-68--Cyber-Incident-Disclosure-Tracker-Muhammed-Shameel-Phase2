import React from 'react';
import { CheckSquare } from 'lucide-react';

export function ResponseChecklist() {
  const checklist = [
    { id: 1, label: 'Identify Impacted Systems' },
    { id: 2, label: 'Notify Regulatory Bodies' },
    { id: 3, label: 'Initiate Incident Response' },
    { id: 4, label: 'Public Disclosure Strategy' },
  ];

  return (
    <section className="border border-zinc-800 p-5 rounded-lg bg-surface">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
        <CheckSquare size={14} className="text-primary-accent" />
        Response Checklist
      </div>
      <ul className="space-y-2">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" className="accent-primary-accent" />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
