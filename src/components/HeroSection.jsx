import React from 'react';
import { Search, Compass, HeartPulse, Users, Shield, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ setActiveModule }) {
  const modules = [
    {
      id: 'lost-person',
      title: 'AI Lost Person Finder',
      sanskrit: 'दृष्टि अन्वेषण',
      tech: 'Face Recognition & CCTV Scanner',
      desc: 'Upload photo of missing elder or child; compares facial landmarks to track last spotted checkpoint.',
      icon: Search,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'shortest-route',
      title: 'Smart Route Finder',
      sanskrit: 'लघुतम मार्ग सेतु',
      tech: 'DSA Graph + Dijkstra\'s Shortest Path Algorithm',
      desc: 'Computes optimal path through congested temple corridors, queue complexes, and altitude ramps.',
      icon: Compass,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'medical-adviser',
      title: 'ML Pre-Medical Adviser',
      sanskrit: 'आरोग्य पूर्वचेतावनी',
      tech: 'Decision Trees & Vital Triage',
      desc: 'Predicts high-altitude sickness (hypoxia, breathlessness, nausea) before entering arduous tracks.',
      icon: HeartPulse,
      color: 'from-red-500 to-pink-600',
    },
    {
      id: 'group-tracker',
      title: 'Group Separation Radar',
      sanskrit: 'संघ रक्षक सचेतक',
      tech: 'Proximity Beacons & Geo-Alerts',
      desc: 'Instant push alerts whenever an elder, kid, or member wanders outside the safe crowd radius.',
      icon: Users,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      id: 'guide-verify',
      title: 'Devotee Anti-Fraud Shield',
      sanskrit: 'सत्य पथ रक्षक',
      tech: 'QR / Badge Verification & Vigilance',
      desc: 'Protects pilgrims from fake guides, unauthorized VIP ticket scams, and extortionate rates.',
      icon: Shield,
      color: 'from-emerald-500 to-teal-700',
    }
  ];

  return (
    <div className="relative mb-12">
      {/* Sacred Arch / Temple Silhouette Banner */}
      <div className="relative rounded-3xl overflow-hidden sacred-glass border border-vedic-gold/30 p-6 sm:p-10 shadow-2xl">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-saffron-prime/20 to-vedic-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-red-900/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          {/* Sacred Tag */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-vedic-gold/10 border border-vedic-gold/30 text-vedic-gold text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-vedic-gold" />
            <span className="font-sanskrit">तीर्थयात्री रक्षणाय समर्पितम्</span>
            <span className="text-white/40">•</span>
            <span>Smart Pilgrim Safety System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-vedic text-white tracking-wide leading-tight mb-4">
            Smart Pilgrim Safety & <br />
            <span className="bg-gradient-to-r from-vedic-gold via-amber-200 to-saffron-glow bg-clip-text text-transparent">
              Sacred Crowd Management
            </span>
          </h1>

          <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed mb-6 max-w-3xl">
            In holy high-altitude and high-density shrines like <strong>Kedarnath, Badrinath, Vaishno Devi, and Tirupati</strong>, 
            millions gather with pure devotion. However, sudden stampedes, family separations, mountain hypoxia, and fake guide rackets 
            create severe peril. <span className="text-vedic-gold font-semibold">DarshanSetu</span> resolves all 5 critical field challenges 
            using <strong>Machine Learning, Dijkstra's Algorithm Navigation Graphs</strong>, and <strong>Firebase Cloud sync</strong>.
          </p>

          {/* Quick System Status Highlights */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-amber-200/90 font-mono">
            <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 5 Pilgrim Safety Modules Active
            </span>
            <span className="bg-white/5 border border-vedic-gold/20 px-3 py-1 rounded-md text-amber-200">
              ⚡ Real-time Crowd, Health & Navigation Guidance
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveModule('lost-person')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-prime to-amber-600 text-white font-bold text-sm shadow-lg shadow-saffron-prime/30 hover:brightness-110 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Launch AI Face Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModule('shortest-route')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-temple-maroon/80 border border-vedic-gold/40 text-vedic-gold font-bold text-sm hover:bg-temple-maroon transition-all shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Route Finder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Problem-Solution Module Cards Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-vedic text-vedic-gold flex items-center space-x-2">
            <span>5 Core Project Deliverables</span>
            <span className="text-xs px-2 py-0.5 rounded bg-vedic-gold/15 text-amber-200 font-sans font-normal">
              Fully Interactive
            </span>
          </h2>
          <span className="text-xs text-white/50 hidden sm:inline">
            Click any module card below to test live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m, index) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className="sacred-glass group rounded-2xl p-5 border border-vedic-gold/20 hover:border-vedic-gold transition-all duration-300 hover:shadow-2xl hover:shadow-saffron-prime/10 cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-sanskrit text-xs text-vedic-gold/80 px-2 py-0.5 rounded bg-white/5 border border-vedic-gold/10">
                      {m.sanskrit}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center space-x-1.5">
                    <span>{m.title}</span>
                  </h3>
                  <div className="text-[11px] font-mono text-saffron-glow font-medium mt-0.5 mb-2">
                    {m.tech}
                  </div>
                  <p className="text-xs text-amber-100/70 leading-relaxed mb-4">
                    {m.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-vedic-gold group-hover:text-saffron-glow">
                  <span>Open Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
