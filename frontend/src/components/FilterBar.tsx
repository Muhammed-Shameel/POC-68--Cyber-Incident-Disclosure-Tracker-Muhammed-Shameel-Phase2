'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, XCircle, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  sectors: string[]; // List of all available sectors for dropdown
  attackTypes: string[]; // List of all available attack types for dropdown
  onFilterChange: (filters: {
    company: string;
    sector: string;
    severity: string;
    attackType: string;
  }) => void;
  onResetFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ sectors, attackTypes, onFilterChange, onResetFilters }) => {
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('All sectors');
  const [severity, setSeverity] = useState('All severity levels');
  const [attackType, setAttackType] = useState('All attack types');

  const handleApplyFilters = () => {
    onFilterChange({
      company: company === '' ? '' : company, // Only pass if not empty
      sector: sector === 'All sectors' ? '' : sector,
      severity: severity === 'All severity levels' ? '' : severity,
      attackType: attackType === 'All attack types' ? '' : attackType,
    });
  };

  const handleReset = () => {
    setCompany('');
    setSector('All sectors');
    setSeverity('All severity levels');
    setAttackType('All attack types');
    onResetFilters();
  };

  const severityOptions = ['All severity levels', 'Critical', 'High', 'Medium', 'Low'];
  const allAttackTypesOptions = ['All attack types', ...attackTypes];


  return (
    <div className="bg-surface p-6 rounded-xl border border-border flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-grow w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          placeholder="Search company..."
          className="w-full pl-10 pr-4 py-2 bg-secondary-surface border border-border rounded-lg focus:outline-none focus:border-primary-accent text-text-primary"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplyFilters();
            }
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <select 
            className="h-10 pr-8 pl-3 bg-secondary-surface border border-border rounded-lg focus:outline-none focus:border-primary-accent text-text-primary appearance-none"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="All sectors">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            className="h-10 pr-8 pl-3 bg-secondary-surface border border-border rounded-lg focus:outline-none focus:border-primary-accent text-text-primary appearance-none"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            {severityOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>

        <div className="relative">
          <select 
            className="h-10 pr-8 pl-3 bg-secondary-surface border border-border rounded-lg focus:outline-none focus:border-primary-accent text-text-primary appearance-none"
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
          >
            {allAttackTypesOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        </div>

        <button
          onClick={handleApplyFilters}
          className="flex items-center gap-2 px-4 py-2 bg-primary-accent text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Apply Filters
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-border text-text-secondary font-semibold rounded-lg hover:bg-secondary-surface transition-colors"
        >
          <XCircle className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;