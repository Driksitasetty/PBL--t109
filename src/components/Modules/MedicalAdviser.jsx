// ============================================================
// MedicalAdviser.jsx — Pre-Travel Health Risk Predictor
// ============================================================
// Uses a Decision Tree ML model (in Flask) to predict
// health risk level before visiting high-altitude temples.
//
// HOW IT WORKS:
// 1. User fills in their health information
// 2. We send the data to Flask backend
// 3. Flask runs the scikit-learn Decision Tree model
// 4. Model predicts risk: Low / Moderate / High
// 5. We show the result with advice
//
// DISCLAIMER: This is an educational demonstration.
// It is NOT a substitute for real medical advice.
// ============================================================

import React, { useState } from 'react';
import { HeartPulse, AlertCircle, CheckCircle, Activity, Info, Brain } from 'lucide-react';
import { predictHealthRisk } from '../../services/api';

// Sample data for quick demonstration
const DEMO_PRESETS = [
  {
    label: 'Young Healthy Adult',
    color: 'text-emerald-300',
    data: { age_group: 1, altitude_category: 2, exertion_level: 1, has_heart_condition: 0, has_breathing_issues: 0, is_diabetic: 0 }
  },
  {
    label: 'Senior with Heart Issue',
    color: 'text-red-300',
    data: { age_group: 2, altitude_category: 2, exertion_level: 2, has_heart_condition: 1, has_breathing_issues: 1, is_diabetic: 0 }
  },
  {
    label: 'Middle-Aged Diabetic',
    color: 'text-amber-300',
    data: { age_group: 1, altitude_category: 1, exertion_level: 1, has_heart_condition: 0, has_breathing_issues: 0, is_diabetic: 1 }
  }
];

export default function MedicalAdviser() {
  // Form state — each value matches a feature column in our ML model
  const [formData, setFormData] = useState({
    age_group:           1,   // 0=Child (under 12), 1=Adult (12-60), 2=Senior (60+)
    altitude_category:   1,   // 0=Low (<1000m), 1=Medium (1000-3000m), 2=High (>3000m)
    exertion_level:      1,   // 0=Easy (walking), 1=Moderate (hiking), 2=Strenuous (climbing)
    has_heart_condition: 0,   // 0=No, 1=Yes
    has_breathing_issues:0,   // 0=No, 1=Yes
    is_diabetic:         0,   // 0=No, 1=Yes
  });

  const [result,    setResult]    = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode,      setMode]      = useState('form'); // 'form' | 'result'
  const [backendMode, setBackendMode] = useState(''); // 'flask' | 'demo'

  // Update one field in the form
  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: parseInt(value) }));
  }

  // Load a demo preset into the form
  function loadPreset(preset) {
    setFormData(preset.data);
    setResult(null);
    setMode('form');
  }

  // Run the prediction — tries Flask, falls back to local logic
  async function handlePredict() {
    setIsLoading(true);
    setResult(null);

    const { data, error } = await predictHealthRisk(formData);

    if (!error && data) {
      setResult(data);
      setBackendMode('flask');
    } else {
      // Demo mode — simple rule-based prediction when Flask is not running
      const result = runDemoPredictor(formData);
      setResult(result);
      setBackendMode('demo');
    }

    setIsLoading(false);
    setMode('result');
  }

  return (
    <div className="space-y-6">

      {/* Module Header */}
      <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-vedic-gold text-xs font-mono mb-1">
              <span className="bg-saffron-prime/20 px-2 py-0.5 rounded border border-saffron-prime/30">MODULE 3</span>
              <span>MACHINE LEARNING — DECISION TREE CLASSIFIER</span>
              {backendMode && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  backendMode === 'flask'
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                }`}>
                  {backendMode === 'flask' ? '🟢 Flask ML Model' : '🟡 Demo Rules'}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold font-vedic text-white">Pre-Travel Health Risk Adviser (आरोग्य पूर्वचेतावनी)</h2>
            <p className="text-xs text-amber-100/70 mt-1 max-w-2xl">
              A <strong>Decision Tree ML model</strong> trained on health parameters predicts your risk level
              before visiting high-altitude pilgrimage sites. Helps pilgrims prepare appropriately.
            </p>
          </div>
          <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-xs text-rose-300 max-w-xs">
            <p className="font-bold text-rose-200 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Medical Disclaimer
            </p>
            <p>This is an educational demonstration only. Not a substitute for real medical consultation.</p>
          </div>
        </div>
      </div>

      {/* Quick Demo Presets */}
      <div className="sacred-glass rounded-2xl p-4 border border-vedic-gold/20">
        <p className="text-xs text-white/50 mb-3">Quick Demo Scenarios (click to load):</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset, i) => (
            <button key={i} onClick={() => loadPreset(preset)}
              className={`px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-medium ${preset.color} hover:bg-white/10 transition-all`}>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'form' ? (
        /* Health Input Form */
        <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/20">
          <h3 className="text-sm font-bold text-vedic-gold mb-5 uppercase tracking-wider">
            Enter Your Health Information:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Age Group */}
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-2">Age Group</label>
              <div className="flex gap-2">
                {[{v:0,l:'Child (under 12)'},{v:1,l:'Adult (12–60)'},{v:2,l:'Senior (60+)'}].map(opt => (
                  <button key={opt.v} onClick={() => handleChange('age_group', opt.v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.age_group === opt.v
                        ? 'bg-saffron-prime/30 border-saffron-prime text-amber-200'
                        : 'bg-black/40 border-white/10 text-white/60 hover:border-white/30'
                    }`}>{opt.l}</button>
                ))}
              </div>
            </div>

            {/* Altitude */}
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-2">Destination Altitude</label>
              <div className="flex gap-2">
                {[{v:0,l:'Low (<1000m)'},{v:1,l:'Medium (1–3km)'},{v:2,l:'High (>3000m)'}].map(opt => (
                  <button key={opt.v} onClick={() => handleChange('altitude_category', opt.v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.altitude_category === opt.v
                        ? 'bg-saffron-prime/30 border-saffron-prime text-amber-200'
                        : 'bg-black/40 border-white/10 text-white/60 hover:border-white/30'
                    }`}>{opt.l}</button>
                ))}
              </div>
            </div>

            {/* Exertion Level */}
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-2">Planned Physical Exertion</label>
              <div className="flex gap-2">
                {[{v:0,l:'Easy (Flat walk)'},{v:1,l:'Moderate (Hiking)'},{v:2,l:'Strenuous (Climbing)'}].map(opt => (
                  <button key={opt.v} onClick={() => handleChange('exertion_level', opt.v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      formData.exertion_level === opt.v
                        ? 'bg-saffron-prime/30 border-saffron-prime text-amber-200'
                        : 'bg-black/40 border-white/10 text-white/60 hover:border-white/30'
                    }`}>{opt.l}</button>
                ))}
              </div>
            </div>

            {/* Health Conditions */}
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-2">Pre-existing Conditions (select all that apply)</label>
              <div className="space-y-2">
                {[
                  { field: 'has_heart_condition',  label: '❤️ Heart Condition (BP, cardiac issues)' },
                  { field: 'has_breathing_issues',  label: '🫁 Breathing Issues (asthma, etc.)' },
                  { field: 'is_diabetic',            label: '🩸 Diabetes' },
                ].map(({ field, label }) => (
                  <button key={field}
                    onClick={() => handleChange(field, formData[field] === 1 ? 0 : 1)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                      formData[field] === 1
                        ? 'bg-red-900/40 border-red-500/50 text-rose-200'
                        : 'bg-black/40 border-white/10 text-white/60 hover:border-white/30'
                    }`}>
                    {label} {formData[field] === 1 ? '✓ Selected' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-sm tracking-wider uppercase shadow-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Brain className="w-5 h-5" />
            <span>{isLoading ? 'ML Model Predicting...' : 'Predict My Health Risk'}</span>
          </button>
        </div>
      ) : (
        /* Prediction Result */
        result && (
          <div className="space-y-4">
            {/* Risk Level Card */}
            <div className={`sacred-glass rounded-2xl p-6 border-2 ${
              result.risk_level === 'Low' || result.risk_score === 0    ? 'border-emerald-500' :
              result.risk_level === 'Moderate' || result.risk_score === 1 ? 'border-amber-500' :
              'border-red-500'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                  result.risk_score === 0 ? 'bg-emerald-900/60' :
                  result.risk_score === 1 ? 'bg-amber-900/60' : 'bg-red-900/60'
                }`}>
                  {result.risk_score === 0 ? '✅' : result.risk_score === 1 ? '⚠️' : '🚨'}
                </div>
                <div>
                  <p className="text-xs text-white/50 font-mono uppercase">ML Prediction Result</p>
                  <h3 className={`text-2xl font-black font-vedic ${
                    result.risk_score === 0 ? 'text-emerald-400' :
                    result.risk_score === 1 ? 'text-amber-400' : 'text-red-400'
                  }`}>{result.risk_level || ['Low', 'Moderate', 'High'][result.risk_score]} Risk</h3>
                  <p className="text-xs text-white/60 mt-1">{result.advice || 'See recommendations below'}</p>
                </div>
              </div>
            </div>

            {/* Precautions */}
            {result.precautions && result.precautions.length > 0 && (
              <div className="sacred-glass rounded-2xl p-5 border border-vedic-gold/20">
                <h4 className="text-xs font-bold text-vedic-gold uppercase mb-3">Recommended Precautions:</h4>
                <ul className="space-y-2">
                  {result.precautions.map((p, i) => (
                    <li key={i} className="flex items-start space-x-2 text-xs text-amber-100/80">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => { setMode('form'); setResult(null); }}
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/20 text-white/70 text-xs hover:bg-white/10 transition-all">
              ← Run Another Assessment
            </button>
          </div>
        )
      )}
    </div>
  );
}

// ── DEMO MODE PREDICTOR ──────────────────────────────────────
// Simple rule-based predictor when Flask is not running.
// Mimics what the Decision Tree ML model does.
function runDemoPredictor(data) {
  let score = 0;

  // Add risk for each factor (similar to how Decision Tree splits features)
  if (data.age_group === 2)          score += 2;  // Senior citizen
  if (data.altitude_category === 2)  score += 2;  // High altitude
  if (data.exertion_level === 2)     score += 1;  // Strenuous activity
  if (data.has_heart_condition === 1) score += 3;  // Heart condition = big risk
  if (data.has_breathing_issues === 1) score += 2; // Breathing issues = risk
  if (data.is_diabetic === 1)        score += 1;  // Diabetes = moderate risk

  const risk_score = score >= 5 ? 2 : score >= 2 ? 1 : 0;
  const levels = ['Low', 'Moderate', 'High'];
  const advice = [
    'You appear healthy for this pilgrimage. Stay hydrated and take breaks.',
    'Take precautions. Carry medicine, rest often, and avoid excessive exertion.',
    'High risk detected. Consult a doctor before traveling to high altitude.',
  ];
  const precautions = [
    ['Drink 2-3 liters of water daily', 'Wear comfortable walking shoes', 'Start early to avoid crowd heat'],
    ['Carry prescribed medicines', 'Take frequent rest breaks', 'Avoid rushing in queue areas', 'Keep a helpline number saved'],
    ['Get medical clearance before travel', 'Carry oxygen supplement', 'Travel with a companion', 'Know the location of medical help desk'],
  ];

  return { risk_score, risk_level: levels[risk_score], advice: advice[risk_score], precautions: precautions[risk_score] };
}
