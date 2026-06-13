'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Incident } from '@/types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown,
  ExternalLink,
  Eye,
  Table as TableIcon
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IncidentTableProps {
  data: Incident[];
}

const columnHelper = createColumnHelper<Incident>();

const columns = [
  columnHelper.accessor('company', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Company
        <ArrowUpDown size={14} />
      </button>
    ),
    cell: (info) => <span className="font-semibold text-text-primary">{info.getValue()}</span>,
  }),
  columnHelper.accessor('sector', {
    header: 'Sector',
    cell: (info) => <span className="text-text-secondary">{info.getValue()}</span>,
  }),
  columnHelper.accessor('attack_type', {
    header: 'Attack Type',
    cell: (info) => (
      <span className="px-2 py-1 bg-secondary-surface text-text-secondary rounded text-xs border border-border">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('severity', {
    header: 'Severity',
    cell: (info) => {
      const severity = info.getValue()?.toUpperCase();
      const colors: Record<string, string> = {
        'CRITICAL': 'text-red-500 bg-red-500/10 border-red-500/20',
        'HIGH': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'MEDIUM': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'LOW': 'text-green-500 bg-green-500/10 border-green-500/20',
      };
      return (
        <span className={cn("px-2 py-1 rounded text-xs border font-medium", colors[severity] || "text-text-secondary bg-secondary-surface border-border")}>
          {severity || 'UNKNOWN'}
        </span>
      );
    },
  }),
  columnHelper.accessor('risk_score', {
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-text-primary transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Risk
        <ArrowUpDown size={14} />
      </button>
    ),
    cell: (info) => {
      const score = info.getValue();
      return (
        <span className={cn(
          "font-mono font-bold",
          score > 7 ? "text-red-500" : score > 4 ? "text-orange-500" : "text-green-500"
        )}>
          {score.toFixed(1)}
        </span>
      );
    },
  }),
  columnHelper.accessor('filing_date', {
    header: 'Date',
    cell: (info) => <span className="text-text-secondary text-sm">{info.getValue()}</span>,
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <div className="flex justify-end gap-2">
        <Link 
          href={`/incidents/${info.row.original.incident_id}`}
          className="p-1 hover:text-text-primary text-text-secondary transition-colors"
          title="View Details"
        >
          <Eye size={18} />
        </Link>
        <a 
          href={info.row.original.filing_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1 hover:text-primary-accent text-text-secondary transition-colors"
          title="Source Filing"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    ),
  }),
];

export function IncidentTable({ data }: IncidentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-accent/10 rounded-lg">
            <TableIcon className="w-5 h-5 text-primary-accent" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Incident Disclosure Log</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          Showing {table.getRowModel().rows.length} of {safeData.length} records
        </div>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search companies, sectors, or descriptions..."
            className="w-full pl-10 pr-4 py-2 bg-secondary-surface border border-border rounded-lg focus:outline-none focus:border-primary-accent transition-colors text-text-primary placeholder:text-text-secondary/50"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary-surface/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-text-secondary italic">
                    No records matched the current intelligence criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                className="p-1 hover:bg-secondary-surface rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-text-secondary"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-text-secondary px-2">
                Page <span className="text-text-primary font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
                <span className="text-text-primary font-medium">{table.getPageCount()}</span>
              </span>
              <button
                className="p-1 hover:bg-secondary-surface rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-text-secondary"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <select
            className="bg-secondary-surface border border-border rounded-md px-2 py-1 text-xs text-text-secondary focus:outline-none focus:border-primary-accent"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
