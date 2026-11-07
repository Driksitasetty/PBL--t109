// ============================================================
// App.jsx — Main Application Entry Point
// ============================================================
// This is the root component that:
//  1. Watches Firebase Auth state (login/logout)
//  2. Renders the correct module based on which tab is clicked
//  3. Shows Emergency SOS modal with Firebase Firestore save
// ============================================================

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import SacredMandalaCanvas from './components/SacredMandalaCanvas';
import Navbar from './components/Navbar';
import RoleSwitcher from './components/RoleSwitcher';
import HeroSection from './components/HeroSection';
import LostPersonFinder from './components/Modules/LostPersonFinder';
import DijkstraRouteFinder from './components/Modules/DijkstraRouteFinder';
import MedicalAdviser from './components/Modules/MedicalAdviser';
import GroupTracker from './components/Modules/GroupTracker';
import GuideVerification from './components/Modules/GuideVerification';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { AlertOctagon, PhoneCall, X, CheckCircle } from 'lucide-react';
import { HELPLINE_CONTACTS } from './data/mockData';
import { playEmergencyAlert } from './utils/audioEffects';
import { onAuthChange, logoutUser, getUserProfile } from './firebase/authService';
import { sendSOSAlert } from './firebase/firestoreService';

export default function App() {
  const [activeModule, setActiveModule] = useState('overview');
  const [currentRole, setCurrentRole] = useState('devotee');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  // Firebase Auth state — tracks the currently logged-in user
  // null means not logged in, user object means logged in
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for login/logout changes from Firebase Auth
  // Also fetches the user's role from Firestore so role-gated features work
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch the user's role from Firestore (pilgrim/staff/admin)
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.role) {
            setCurrentRole(profile.role === 'family' ? 'devotee' : profile.role);
          }
        } catch (err) {
          console.warn('Could not fetch user role:', err);
        }
      } else {
        setCurrentUser(null);
        setCurrentRole('devotee');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Triggers emergency alert sound + opens SOS modal
  const handleTriggerEmergency = () => {
    playEmergencyAlert();
    setEmergencyModalOpen(true);
    setSosSent(false);
  };

  // Sends SOS beacon — saves to Firestore if logged in, simulates if not
  const handleSendSosBroadcast = async () => {
    setSosSent(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF6F00', '#D4AF37', '#DC2626']
    });

    // Save to Firebase Firestore if user is logged in
    if (currentUser) {
      try {
        await sendSOSAlert(
          currentUser.uid,
          currentUser.displayName || 'Anonymous Pilgrim',
          { lat: 30.7346, lng: 79.0669, altitudeMeters: 3583, landmark: 'Kedarnath Sanctum' },
          'Emergency SOS — Pilgrim needs immediate assistance'
        );
      } catch (err) {
        // Firebase not configured yet — SOS still shows on UI
        console.log('Firebase SOS save skipped (not configured)');
      }
    }
  };

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-vedic-gold font-vedic text-xl animate-pulse">🛕 DarshanSetu Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-saffron-prime selection:text-white">

      {/* Background: Animated Vedic Chakra + Golden Particle Canvas */}
      <SacredMandalaCanvas />

      {/* Main App Layout */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Top Navigation Bar — passes user state for login button */}
        <Navbar
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          onTriggerEmergency={handleTriggerEmergency}
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={logoutUser}
        />

        {/* Page Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Role Selector: Devotee / Family / Staff / Admin */}
          <RoleSwitcher currentRole={currentRole} setCurrentRole={setCurrentRole} />

          {/* Render the active module based on which tab is clicked */}
          {/* currentUser is passed to modules so they can save to Firebase */}
          {activeModule === 'overview'        && <HeroSection setActiveModule={setActiveModule} />}
          {activeModule === 'lost-person'     && <LostPersonFinder currentRole={currentRole} currentUser={currentUser} />}
          {activeModule === 'shortest-route'  && <DijkstraRouteFinder currentRole={currentRole} currentUser={currentUser} />}
          {activeModule === 'medical-adviser' && <MedicalAdviser currentRole={currentRole} currentUser={currentUser} />}
          {activeModule === 'group-tracker'   && <GroupTracker currentRole={currentRole} currentUser={currentUser} />}
          {activeModule === 'guide-verify'    && <GuideVerification currentRole={currentRole} currentUser={currentUser} />}

        </main>

        {/* Footer */}
        <Footer setActiveModule={setActiveModule} />
      </div>

      {/* Firebase Login / Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          // The onAuthChange listener above will pick up the new user automatically.
          // We just close the modal here.
          setAuthModalOpen(false);
        }}
      />

      {/* Emergency SOS Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="sacred-glass max-w-lg w-full rounded-3xl p-6 border-2 border-red-500 shadow-2xl relative">
            <button
              onClick={() => setEmergencyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white animate-pulse">
                <AlertOctagon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  Pilgrim Emergency SOS Beacon
                </h3>
                <p className="text-xs text-rose-300">
                  {currentUser
                    ? `Logged in as: ${currentUser.displayName || currentUser.email}`
                    : 'Direct Line to NDRF, SDRF & Kedarnath / Tirupati Quick Response Unit'}
                </p>
              </div>
            </div>

            {/* After SOS is sent — show confirmation */}
            {sosSent ? (
              <div className="bg-emerald-950/70 border border-emerald-500 p-5 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-10 h-10 mx-auto text-emerald-400" />
                <h4 className="text-sm font-bold text-white">EMERGENCY DISPATCH CONFIRMED!</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Your coordinates (Lat: 30.7346° N, Long: 79.0669° E, Alt: 3,583m) have been
                  {currentUser ? ' saved to Firebase & ' : ' '} transmitted to
                  <strong> Pilgrim Patrol Post #2</strong>. A paramedic team is heading to your position.
                </p>
                <a
                  href="tel:108"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg hover:bg-red-500"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Medical Control 108</span>
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-black/50 p-3.5 rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex justify-between text-white/70">
                    <span>Simulated GPS Fix:</span>
                    <span className="font-mono text-amber-300">30.7346° N, 79.0669° E</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Nearest Oxygen Aid Booth:</span>
                    <span className="text-emerald-400 font-bold">180m (Base Camp Post #2)</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Firebase SOS Save:</span>
                    <span className={currentUser ? 'text-emerald-400' : 'text-amber-400'}>
                      {currentUser ? '✓ Will save to Firestore' : 'Login for Firestore save'}
                    </span>
                  </div>
                </div>

                {/* Emergency Helpline Tiles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {HELPLINE_CONTACTS.slice(0, 4).map((h, i) => (
                    <a
                      key={i}
                      href={`tel:${h.number}`}
                      className="bg-temple-maroon/70 hover:bg-temple-maroon p-2.5 rounded-xl border border-vedic-gold/20 flex flex-col justify-between"
                    >
                      <span className="text-[10px] text-white/60">{h.name}</span>
                      <span className="font-mono font-bold text-vedic-gold text-sm mt-1">{h.number}</span>
                    </a>
                  ))}
                </div>

                <button
                  onClick={handleSendSosBroadcast}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-red-700/50 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Transmit Emergency Beacon Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
