import React, { useState } from 'react';
import { Shield, AlertOctagon, Users, Compass, HeartPulse, Search, Bell, LogIn, LogOut, User } from 'lucide-react';
import { playTempleBell } from '../utils/audioEffects';

export default function Navbar({ activeModule, setActiveModule, onTriggerEmergency, currentUser, onOpenAuth, onLogout }) {
  const [activePilgrimSite, setActivePilgrimSite] = useState('Kedarnath Dham');
  const [isBellRinging, setIsBellRinging] = useState(false);

  // The 5 module tabs shown at the bottom of the navbar
  const navigationTabs = [
    { id: 'lost-person',     label: '1. Lost Person Finder',  icon: Search,    badge: 'AI Vision' },
    { id: 'shortest-route',  label: '2. Smart Route Finder',  icon: Compass,   badge: 'Dijkstra'  },
    { id: 'medical-adviser', label: '3. Pre-Medical AI',      icon: HeartPulse,badge: 'ML'        },
    { id: 'group-tracker',   label: '4. Group Radar & Alert', icon: Users,     badge: 'Live Geo'  },
    { id: 'guide-verify',    label: '5. Anti-Fraud & Guides', icon: Shield,    badge: 'Vigilance' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-temple-dark/90 border-b border-vedic-gold/20 shadow-2xl">

      {/* Top Banner: Sanskrit Shloka + System Status */}
      <div className="bg-gradient-to-r from-temple-maroon via-saffron-prime/30 to-temple-maroon py-1 px-4 text-xs flex justify-between items-center border-b border-vedic-gold/10">
        <div className="flex items-center space-x-2 text-vedic-gold font-sanskrit text-sm">
          <span>ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</span>
          <span className="text-white/40 hidden md:inline">|</span>
          <span className="text-white/70 font-sans hidden md:inline">
            May all pilgrims journey in divine health &amp; safety
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-200">
          <span className="bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PILGRIM SAFETY NETWORK ACTIVE
          </span>
        </div>
      </div>

      {/* Main Navbar: Logo + Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Logo — click to go back to home overview */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveModule('overview')}>
          <div className="relative group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-prime via-vedic-gold to-temple-maroon p-[2px] shadow-lg shadow-saffron-prime/20">
              <div className="w-full h-full bg-temple-dark rounded-[10px] flex items-center justify-center">
                <span className="text-2xl select-none group-hover:scale-110 transition-transform">🛕</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-temple-dark animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-vedic tracking-wide bg-gradient-to-r from-vedic-gold via-amber-200 to-saffron-glow bg-clip-text text-transparent">
                DarshanSetu
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-vedic-gold/15 text-vedic-gold border border-vedic-gold/30 font-mono">
                Smart Pilgrim Safety
              </span>
            </div>
            <p className="text-[11px] text-amber-200/60 font-medium">Smart Pilgrim Safety &amp; Vedic Crowd Management</p>
          </div>
        </div>

        {/* Right Side: Shrine Selector + Bell + Emergency */}
        <div className="flex items-center space-x-3">

          {/* Shrine Location Dropdown */}
          <div className="hidden lg:flex items-center space-x-1 bg-temple-maroon/60 border border-vedic-gold/25 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-amber-300/70">Pilgrim Dham:</span>
            <select
              value={activePilgrimSite}
              onChange={(e) => setActivePilgrimSite(e.target.value)}
              className="bg-transparent text-vedic-gold font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Kedarnath Dham"      className="bg-temple-dark text-slate-100">Kedarnath High Altitude</option>
              <option value="Tirumala Tirupati"   className="bg-temple-dark text-slate-100">Tirumala Tirupati Devasthanam</option>
              <option value="Vaishno Devi Shrine" className="bg-temple-dark text-slate-100">Vaishno Devi Shrine</option>
              <option value="Badrinath Dham"      className="bg-temple-dark text-slate-100">Badrinath Dham</option>
              <option value="Kashi Vishwanath"    className="bg-temple-dark text-slate-100">Kashi Vishwanath Corridor</option>
            </select>
          </div>

          {/* Temple Bell Button — plays Web Audio API chime */}
          <button
            onClick={() => {
              playTempleBell();
              setIsBellRinging(true);
              setTimeout(() => setIsBellRinging(false), 1200);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-vedic-gold/15 text-vedic-gold border border-vedic-gold/40 hover:bg-vedic-gold/25 transition-all ${
              isBellRinging ? 'scale-105 bg-vedic-gold/30' : ''
            }`}
            title="Ring Divine Temple Bell"
          >
            <Bell className={`w-3.5 h-3.5 ${isBellRinging ? 'text-amber-300 animate-bounce' : 'text-vedic-gold'}`} />
            <span className="hidden sm:inline">Mandir Ghanti</span>
            <span className="sm:hidden">Bell</span>
          </button>

          {/* Firebase Login / Logout Button */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:flex items-center space-x-1.5 text-xs text-amber-200/70 font-mono">
                <User className="w-3.5 h-3.5 text-vedic-gold" />
                <span>{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
              </span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/20 hover:bg-white/10 transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-vedic-gold/20 text-vedic-gold border border-vedic-gold/40 hover:bg-vedic-gold/30 transition-all"
              title="Login with Firebase"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login / Register</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* Emergency SOS Button — triggers alert modal */}
          <button
            onClick={onTriggerEmergency}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-700/40 border border-red-400/40 animate-pulse transition-all active:scale-95"
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>EMERGENCY SOS</span>
          </button>
        </div>
      </div>

      {/* Module Tabs — bottom of navbar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-vedic-gold/10 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 py-1.5">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-saffron-prime to-amber-600 text-white shadow-md shadow-saffron-prime/30 font-semibold'
                    : 'text-amber-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-vedic-gold'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-black/25 text-amber-100' : 'bg-vedic-gold/10 text-vedic-gold/80'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
