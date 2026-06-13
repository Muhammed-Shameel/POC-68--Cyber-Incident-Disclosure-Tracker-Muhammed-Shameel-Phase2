'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShieldAlert, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Incidents', href: '/incidents', icon: ShieldAlert },
];

const dashboardItems = [
  { name: 'Filters', href: '/dashboard' },
  { name: 'Executive Summary', href: '/dashboard' },
  { name: 'Why This Matters', href: '/dashboard' },
  { name: 'Threat Landscape', href: '/dashboard' },
  { name: 'Export', href: '/dashboard' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-900 text-white rounded-md lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-zinc-950 border-r border-zinc-800 transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-8 border-b border-zinc-800">
            <ShieldAlert className="text-red-500" size={28} />
            <span className="text-xl font-bold tracking-tight text-white">CyberTracker</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {pathname === '/dashboard' && (
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <span className="px-4 text-xs font-semibold uppercase text-zinc-500">Dashboard</span>
                {dashboardItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          <div className="px-6 py-8 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                EX
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Executive User</span>
                <span className="text-xs text-zinc-500">Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
