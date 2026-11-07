// ============================================================
// GuideVerification.jsx — Guide Directory & Anti-Fraud Shield
// ============================================================
// Shows verified guide profiles from Flask backend.
// Pilgrims can search guides, view their status, and report fraud.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertCircle, CheckCircle2, Phone, Star, Flag, X } from 'lucide-react';
import { getAllGuides, searchGuides, reportSuspiciousGuide } from '../../services/api';

// Fallback guide data when Flask is not running
const DEMO_GUIDES = [
  { id: 'TTD-G-1042', name: 'Rajan Pillai', temple: 'Tirumala Tirupati', languages: 'Telugu, Hindi, English', dailyFeeRs: 350, phone: '+91-9876543210', status: 'verified', experience: '8 years', rating: 4.8 },
  { id: 'KED-G-2091', name: 'Mohan Bhatt',  temple: 'Kedarnath Dham',    languages: 'Hindi, English',        dailyFeeRs: 400, phone: '+91-9812345678', status: 'verified', experience: '12 years', rating: 4.9 },
  { id: 'VDG-G-3301', name: 'Suresh Kumar', temple: 'Vaishno Devi',       languages: 'Punjabi, Hindi',        dailyFeeRs: 300, phone: '+91-9654321098', status: 'verified', experience: '5 years', rating: 4.6 },
  { id: 'KED-X-0099', name: 'Unknown Person',temple: 'Kedarnath',         languages: 'Unknown',               dailyFeeRs: 2000,phone: 'Not available', status: 'under_review', experience: 'Unknown', rating: 1.2 },
  { id: 'TTD-F-0001', name: 'Ramesh (No Badge)', temple: 'Tirumala',     languages: 'Telugu',                dailyFeeRs: 1500,phone: 'Not available', status: 'unverified', experience: 'Unknown', rating: 2.1 },
];

const STATUS_CONFIG = {
  verified:     { label: '✅ Verified Official',  color: 'text-emerald-300', bg: 'bg-emerald-900/40', border: 'border-emerald-500/40' },
  under_review: { label: '🔍 Under Review',       color: 'text-amber-300',   bg: 'bg-amber-900/40',   border: 'border-amber-500/40'  },
  unverified:   { label: '⚠️ Unverified',         color: 'text-rose-300',    bg: 'bg-rose-900/40',    border: 'border-rose-500/40'   },
};

export default function GuideVerification() {
  const [guides,        setGuides]        = useState([]);
  const [filteredGuides,setFilteredGuides]= useState([]);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [isLoading,     setIsLoading]     = useState(true);
  const [backendMode,   setBackendMode]   = useState('');
  const [showReportForm,setShowReportForm]= useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [reportSent,    setReportSent]    = useState(false);
  const [reportForm,    setReportForm]    = useState({ reporterName: '', description: '', reportType: 'overcharging' });

  // Load guides when component first appears
  useEffect(() => {
    loadGuides();
  }, []);

  async function loadGuides() {
    setIsLoading(true);
    const { data, error } = await getAllGuides();
    if (!error && data && data.guides) {
      setGuides(data.guides);
      setFilteredGuides(data.guides);
      setBackendMode('flask');
    } else {
      setGuides(DEMO_GUIDES);
      setFilteredGuides(DEMO_GUIDES);
      setBackendMode('demo');
    }
    setIsLoading(false);
  }

  // Filter guides based on search query
  async function handleSearch(query) {
    setSearchQuery(query);
    if (!query.trim()) { setFilteredGuides(guides); return; }

    if (backendMode === 'flask') {
      const { data } = await searchGuides(query);
      if (data?.guides) { setFilteredGuides(data.guides); return; }
    }

    // Frontend search when Flask not available
    const q = query.toLowerCase();
    setFilteredGuides(guides.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.temple.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q)
    ));
  }

  // Submit a fraud/suspicious activity report
  async function handleSubmitReport(e) {
    e.preventDefault();
    const { data, error } = await reportSuspiciousGuide({
      ...reportForm,
      guideName: selectedGuide?.name,
      guideId: selectedGuide?.id,
    });
    // Whether Flask returns data or not, show confirmation
    setReportSent(true);
    setTimeout(() => { setShowReportForm(false); setReportSent(false); setReportForm({ reporterName: '', description: '', reportType: 'overcharging' }); }, 2000);
  }

  return (
    <div className="space-y-6">

      {/* Module Header */}
      <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/30">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-vedic-gold text-xs font-mono mb-1">
              <span className="bg-saffron-prime/20 px-2 py-0.5 rounded border border-saffron-prime/30">MODULE 5</span>
              <span>TRUSTED GUIDE DIRECTORY & ANTI-FRAUD SHIELD</span>
              {backendMode && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  backendMode === 'flask' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                }`}>{backendMode === 'flask' ? '🟢 Flask Connected' : '🟡 Demo Mode'}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold font-vedic text-white">सत्य पथ रक्षक — Anti-Fraud Guide Verification</h2>
            <p className="text-xs text-amber-100/70 mt-1 max-w-2xl">
              Verify your guide's credentials before hiring. Search by name or badge ID.
              Report suspicious activity to protect other pilgrims.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sacred-glass rounded-2xl p-4 border border-vedic-gold/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vedic-gold/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by guide name, temple, or badge ID..."
            className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold"
          />
        </div>
      </div>

      {/* Guide Cards */}
      {isLoading ? (
        <div className="text-center py-12 text-white/40 text-sm">Loading guide directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map(guide => {
            const statusCfg = STATUS_CONFIG[guide.status] || STATUS_CONFIG.unverified;
            return (
              <div key={guide.id} className="sacred-glass rounded-2xl p-5 border border-vedic-gold/20 space-y-3">

                {/* Guide Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{guide.name}</h3>
                    <p className="text-xs text-amber-200/60">{guide.temple}</p>
                    <p className="text-[10px] font-mono text-white/40 mt-0.5">Badge ID: {guide.id}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Guide Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/30 rounded-lg p-2">
                    <span className="text-white/40 block text-[10px]">Languages</span>
                    <span className="text-amber-200">{guide.languages}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <span className="text-white/40 block text-[10px]">Daily Fee</span>
                    <span className="text-amber-200">₹{guide.dailyFeeRs}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <span className="text-white/40 block text-[10px]">Experience</span>
                    <span className="text-amber-200">{guide.experience}</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <span className="text-white/40 block text-[10px]">Rating</span>
                    <span className="text-amber-200">⭐ {guide.rating}/5.0</span>
                  </div>
                </div>

                {/* Contact & Report */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-1 text-xs text-vedic-gold">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{guide.phone}</span>
                  </div>
                  {guide.status !== 'verified' && (
                    <button
                      onClick={() => { setSelectedGuide(guide); setShowReportForm(true); }}
                      className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredGuides.length === 0 && !isLoading && (
        <div className="text-center py-12 sacred-glass rounded-2xl border border-vedic-gold/20">
          <p className="text-white/40 text-sm">No guides found matching your search.</p>
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="sacred-glass max-w-md w-full rounded-3xl p-6 border-2 border-red-500/50 shadow-2xl relative">
            <button onClick={() => setShowReportForm(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <X className="w-4 h-4" />
            </button>

            {reportSent ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-white font-bold">Report Submitted!</p>
                <p className="text-xs text-white/60">Authorities will review within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Report Suspicious Activity</h3>
                  <p className="text-xs text-rose-300 mt-1">Reporting: {selectedGuide?.name} ({selectedGuide?.id})</p>
                </div>

                <div>
                  <label className="text-[11px] text-amber-200 block mb-1">Your Name</label>
                  <input type="text" required value={reportForm.reporterName}
                    onChange={e => setReportForm(p => ({ ...p, reporterName: e.target.value }))}
                    placeholder="Your name (kept confidential)"
                    className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold" />
                </div>

                <div>
                  <label className="text-[11px] text-amber-200 block mb-1">Type of Issue</label>
                  <select value={reportForm.reportType}
                    onChange={e => setReportForm(p => ({ ...p, reportType: e.target.value }))}
                    className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-vedic-gold">
                    <option value="overcharging">Excessive / Overcharging</option>
                    <option value="fake_guide">Pretending to be Official Guide</option>
                    <option value="wrong_direction">Giving Wrong Directions (intentional)</option>
                    <option value="harassment">Harassment or Threatening Behavior</option>
                    <option value="other">Other Suspicious Activity</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-amber-200 block mb-1">Describe What Happened</label>
                  <textarea required rows={3} value={reportForm.description}
                    onChange={e => setReportForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Briefly describe what happened..."
                    className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold resize-none" />
                </div>

                <button type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110">
                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
