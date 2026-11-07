import React from 'react';
import { User, Users, ShieldAlert, Cpu } from 'lucide-react';

export const ROLES = [
  {
    id: 'devotee',
    name: 'Devotee / Pilgrim',
    icon: User,
    badge: 'Trekker Access',
    description: 'Access route navigation, pre-medical advisory, group safety radar, and guide verification.'
  },
  {
    id: 'family',
    name: 'Family Member',
    icon: Users,
    badge: 'Safety Net',
    description: 'Monitor separated elders/children, upload missing person photo, receive live radar alerts.'
  },
  {
    id: 'staff',
    name: 'Temple Staff / Volunteer',
    icon: ShieldAlert,
    badge: 'Ground Control',
    description: 'Manage queue congestion, verify reported fraud guides, receive emergency medical SOS alerts.'
  },
  {
    id: 'admin',
    name: 'Shrine Board Admin',
    icon: Cpu,
    badge: 'System Command',
    description: 'Global CCTV AI vision feed, Dijkstra graph weight updates, ML decision tree tuning, Firebase logs.'
  }
];

export default function RoleSwitcher({ currentRole, setCurrentRole }) {
  return (
    <div className="sacred-glass rounded-2xl p-4 mb-6 border border-vedic-gold/20 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-prime opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-saffron-prime"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-vedic-gold font-mono">
            Active Role Simulation (As per Project Proposal)
          </span>
        </div>
        <span className="text-xs text-amber-200/70">
          Click any role below to simulate the user experience:
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-saffron-prime/20 via-temple-maroon to-temple-card border-vedic-gold shadow-lg shadow-saffron-prime/10 ring-1 ring-vedic-gold/50'
                  : 'bg-black/30 border-white/10 hover:border-vedic-gold/40 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-saffron-prime text-white' : 'bg-white/10 text-vedic-gold'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isSelected ? 'bg-vedic-gold/20 text-vedic-gold-light border border-vedic-gold/30' : 'text-white/40'
                }`}>
                  {role.badge}
                </span>
              </div>
              <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {role.name}
              </p>
              <p className="text-[11px] text-amber-100/60 line-clamp-1 mt-0.5">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
