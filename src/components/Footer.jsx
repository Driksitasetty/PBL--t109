import React from 'react';
import { Heart, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { HELPLINE_CONTACTS } from '../data/mockData';

export default function Footer({ setActiveModule }) {
  return (
    <footer className="mt-16 border-t border-vedic-gold/20 bg-temple-card/90 backdrop-blur-md relative z-10 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Sanskrit blessing */}
        <div className="text-center mb-8">
          <p className="font-sanskrit text-vedic-gold text-base sm:text-lg tracking-wide mb-1">
            ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥
          </p>
          <p className="text-xs text-white/50 font-sans">
            "Lead us from the unreal to the real, from darkness to light, from mortality to immortality."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-b border-white/10 text-xs">
          {/* Brand & Project Info */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">🛕</span>
              <span className="font-vedic font-bold text-white text-base">DarshanSetu</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Smart Pilgrim Safety & Vedic Crowd Management System engineered for high-density shrines 
              across India. Powered by React, Flask, Scikit-learn ML, Dijkstra Graph DSA, and Firebase.
            </p>
          </div>

          {/* 24x7 Emergency Helplines */}
          <div>
            <h4 className="font-bold text-vedic-gold uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              24x7 Emergency Pilgrim Helplines
            </h4>
            <div className="space-y-1.5 text-white/80">
              {HELPLINE_CONTACTS.slice(0, 3).map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-black/30 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-white/90">{h.name}</span>
                  <span className="text-xs font-mono text-amber-300 font-bold">{h.number}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Module Navigation */}
          <div>
            <h4 className="font-bold text-vedic-gold uppercase tracking-wider text-[11px] mb-3">
              Project Modules
            </h4>
            <div className="grid grid-cols-1 gap-1 text-white/70">
              <button onClick={() => setActiveModule('lost-person')} className="text-left hover:text-vedic-gold transition-colors">
                • Module 1: AI Lost Person Finder
              </button>
              <button onClick={() => setActiveModule('shortest-route')} className="text-left hover:text-vedic-gold transition-colors">
                • Module 2: Smart Route Finder (Dijkstra Algorithm)
              </button>
              <button onClick={() => setActiveModule('medical-adviser')} className="text-left hover:text-vedic-gold transition-colors">
                • Module 3: ML Pre-Medical Adviser
              </button>
              <button onClick={() => setActiveModule('group-tracker')} className="text-left hover:text-vedic-gold transition-colors">
                • Module 4: Group Separation Alert Radar
              </button>
              <button onClick={() => setActiveModule('guide-verify')} className="text-left hover:text-vedic-gold transition-colors">
                • Module 5: Devotee Fraud & Guide Shield
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 text-center text-[11px] text-white/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            DarshanSetu: Smart Pilgrim Safety System
          </span>
          <span className="flex items-center space-x-1">
            <span>Crafted with devotion for pilgrim safety</span>
            <Sparkles className="w-3 h-3 text-vedic-gold inline" />
          </span>
        </div>
      </div>
    </footer>
  );
}
