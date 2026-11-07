import React, { useState, useEffect } from 'react';
import { Users, Radio, AlertTriangle, Bell, Compass, Volume2, ShieldCheck, BatteryCharging, Send, Smartphone, Plus, UserPlus } from 'lucide-react';
import { MOCK_GROUP_MEMBERS } from '../../data/mockData';
import { playEmergencyAlert } from '../../utils/audioEffects';
import { createGroup, joinGroup, getGroupMembers, updateMemberLocation } from '../../services/api';

export default function GroupTracker({ currentRole, currentUser }) {
  const [members, setMembers] = useState(MOCK_GROUP_MEMBERS);
  const [maxSafeDistance, setMaxSafeDistance] = useState(50); // meters
  const [activeAlert, setActiveAlert] = useState(null);
  const [pingStatus, setPingStatus] = useState({});
  const [backendMode, setBackendMode] = useState('demo');
  const [groupId, setGroupId] = useState('GRP-KEDAR-01');
  const [groupCode, setGroupCode] = useState('DS-4821');
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Check if any member exceeded threshold
  const separatedMembers = members.filter(m => m.distanceMeters > maxSafeDistance);

  // Fetch group members if connected
  useEffect(() => {
    async function fetchGroupData() {
      const { data, error } = await getGroupMembers(groupId);
      if (!error && data && data.members) {
        setMembers(data.members);
        setBackendMode('flask');
      }
    }
    fetchGroupData();
  }, [groupId]);

  // Simulation: Trigger separation event
  const handleSimulateSeparation = async () => {
    playEmergencyAlert();
    const updated = members.map(m => {
      if (m.id === 'gm-4' || m.name.includes('Meera') || m.name.includes('Vijeta')) {
        return {
          ...m,
          distanceMeters: 175,
          status: 'CRITICAL SEPARATION',
          altitude: '3,560 m'
        };
      }
      return m;
    });
    setMembers(updated);
    setActiveAlert("EMERGENCY: Group member is 175m away in the dense Sanctum queue! Loud chime alert dispatched.");

    // Update backend state
    await updateMemberLocation(groupId, 'gm-4', 30.7358, 79.0682);
  };

  const handleResetGroup = () => {
    setMembers(MOCK_GROUP_MEMBERS);
    setActiveAlert(null);
  };

  const handlePingMember = (id, name) => {
    setPingStatus(prev => ({ ...prev, [id]: 'PINGING...' }));
    setTimeout(() => {
      setPingStatus(prev => ({ ...prev, [id]: 'VIBRATED & BUZZED!' }));
      setTimeout(() => {
        setPingStatus(prev => ({ ...prev, [id]: null }));
      }, 3000);
    }, 1000);
  };

  const handleAddNewMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newId = `gm-${members.length + 1}`;
    const newMemberObj = {
      id: newId,
      name: newMemberName,
      role: 'Family Member',
      distanceMeters: Math.floor(15 + Math.random() * 25),
      battery: '95%',
      status: 'Safe',
      pulseBpm: 78,
      altitude: '3,583 m'
    };

    setMembers(prev => [...prev, newMemberObj]);
    setNewMemberName('');
    setShowAddMemberModal(false);

    // Call Flask backend if connected
    await joinGroup(groupCode, newMemberName);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-vedic-gold text-xs font-mono mb-1">
              <span className="bg-saffron-prime/20 px-2 py-0.5 rounded border border-saffron-prime/30">
                MODULE 4
              </span>
              <span>GEO-FENCE & PROXIMITY BEACON SENSING</span>
              <span className="bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                🟢 Live Sync Active
              </span>
            </div>
            <h2 className="text-2xl font-bold font-vedic text-white">
              Group Separation Radar & Emergency Alert (संघ रक्षक सचेतक)
            </h2>
            <p className="text-xs text-amber-100/70 mt-1 max-w-2xl">
              Family members travelling in large pilgrim groups routinely get split apart during 
              aartis, prasad distribution, and bathing ghats. Our system creates a localized Bluetooth/GPS geo-fence 
              and triggers instant multi-member phone chimes when someone strays outside safety limits.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-black/40 border border-vedic-gold/30 px-3 py-1.5 rounded-xl">
            <Radio className="w-4 h-4 text-saffron-glow animate-pulse" />
            <span className="text-xs font-mono text-amber-200">Group Safe Radius: {maxSafeDistance}m</span>
          </div>
        </div>
      </div>

      {/* Emergency Notification Banner if Separation Detected */}
      {separatedMembers.length > 0 && (
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-2 border-red-500 rounded-2xl p-4 shadow-xl shadow-red-900/40 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                🚨 Immediate Member Separation Alert!
              </h3>
              <p className="text-xs text-rose-200">
                {separatedMembers.map(m => `${m.name} (${m.distanceMeters}m away)`).join(', ')} exceeded the {maxSafeDistance}m safety threshold!
              </p>
            </div>
          </div>
          <button
            onClick={() => handlePingMember('all', 'Entire Group')}
            className="px-4 py-2 bg-white text-red-700 hover:bg-rose-100 rounded-xl font-bold text-xs shadow-md whitespace-nowrap"
          >
            🔊 Sound Loud Emergency Alarm On All Phones
          </button>
        </div>
      )}

      {/* Main Grid: Live Circular Radar & Member Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Simulated Radar Scope */}
        <div className="lg:col-span-6 space-y-6">
          <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/20 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-vedic-gold flex items-center space-x-2">
                <Radio className="w-4 h-4 text-saffron-glow" />
                <span>360° Live Pilgrim Proximity Radar</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                BLE RSSI + GPS Sync
              </span>
            </div>

            {/* Radar Scope */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-black/80 border-2 border-vedic-gold/40 shadow-inner flex items-center justify-center overflow-hidden my-2">
              {/* Concentric distance rings */}
              <div className="absolute inset-8 rounded-full border border-vedic-gold/15"></div>
              <div className="absolute inset-20 rounded-full border border-vedic-gold/20"></div>
              <div className="absolute inset-32 rounded-full border border-vedic-gold/30"></div>

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-vedic-gold/20"></div>
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-vedic-gold/20"></div>

              {/* Rotating Radar Sweep Line */}
              <div className="absolute inset-0 origin-center animate-spin-slow pointer-events-none">
                <div className="w-1/2 h-1/2 border-r border-saffron-prime/60 bg-gradient-to-l from-saffron-prime/20 to-transparent transform origin-bottom-right"></div>
              </div>

              {/* Center point: Leader (You) */}
              <div className="absolute z-20 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-saffron-prime border-2 border-white shadow-lg shadow-saffron-prime animate-pulse"></div>
                <span className="text-[9px] font-bold text-white mt-1 bg-black/60 px-1 rounded">
                  YOU
                </span>
              </div>

              {/* Member Blips plotted based on distance */}
              <div className="absolute top-[38%] left-[62%] z-20 flex flex-col items-center group cursor-pointer">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-white shadow"></div>
                <span className="text-[8px] text-emerald-200 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  Grandpa (18m)
                </span>
              </div>

              <div className="absolute bottom-[30%] left-[34%] z-20 flex flex-col items-center group cursor-pointer">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-white shadow"></div>
                <span className="text-[8px] text-emerald-200 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
                  Aarav (28m)
                </span>
              </div>

              {/* Separated outlier */}
              {separatedMembers.length > 0 && (
                <div className="absolute top-[8%] right-[10%] z-20 flex flex-col items-center group cursor-pointer animate-bounce">
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg shadow-red-500 animate-ping absolute"></div>
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-lg shadow-red-500 relative"></div>
                  <span className="text-[9px] font-bold text-rose-300 bg-red-950/90 border border-rose-500 px-1.5 rounded mt-1 whitespace-nowrap">
                    {separatedMembers[0].name} ({separatedMembers[0].distanceMeters}m - ALERT)
                  </span>
                </div>
              )}
            </div>

            {/* Threshold Slider */}
            <div className="w-full mt-4 bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-white/70">Safety Separation Distance Limit:</span>
                <span className="font-mono font-bold text-vedic-gold">{maxSafeDistance} Meters</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={maxSafeDistance}
                onChange={(e) => setMaxSafeDistance(Number(e.target.value))}
                className="w-full accent-saffron-prime cursor-pointer"
              />
              <span className="text-[10px] text-white/40 block mt-1">
                Automatic phone alert vibrates when distance exceeds {maxSafeDistance}m in dense crowd.
              </span>
            </div>

            {/* Test Simulation Buttons */}
            <div className="w-full flex space-x-2 mt-3">
              <button
                onClick={handleSimulateSeparation}
                className="flex-1 py-2 rounded-lg bg-red-950/80 border border-red-500/50 hover:bg-red-900 text-rose-200 font-semibold text-xs transition-all"
              >
                Simulate Member Strayed (175m)
              </button>
              <button
                onClick={handleResetGroup}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 text-xs transition-all"
              >
                Reset Radar
              </button>
            </div>
          </div>
        </div>

        {/* Right: Group Roster & Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="sacred-glass rounded-2xl p-5 border border-vedic-gold/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-vedic-gold flex items-center space-x-2">
                  <Users className="w-4 h-4 text-saffron-glow" />
                  <span>Yatra Travel Group (T109-DarshanSathi)</span>
                </h3>
                <span className="text-[11px] text-white/50 font-mono">Invite Code: <strong>{groupCode}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-saffron-prime/30 border border-saffron-prime text-amber-200 text-xs font-semibold flex items-center space-x-1 hover:bg-saffron-prime/50 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {members.length} Pilgrims Synced
                </span>
              </div>
            </div>

            {/* Add Member Quick Box */}
            {showAddMemberModal && (
              <form onSubmit={handleAddNewMember} className="mb-4 p-3 bg-black/50 border border-vedic-gold/30 rounded-xl space-y-2">
                <span className="text-xs text-amber-200 font-semibold block">Register New Pilgrim Member to Group:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter member name (e.g. Vijeta Saini)..."
                    className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-vedic-gold"
                  />
                  <button type="submit" className="px-3 py-1.5 rounded-lg bg-saffron-prime text-white text-xs font-bold hover:brightness-110">
                    Join
                  </button>
                  <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {members.map((member) => {
                const isSeparated = member.distanceMeters > maxSafeDistance;
                const pingState = pingStatus[member.id];

                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSeparated
                        ? 'bg-rose-950/40 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-black/40 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSeparated ? 'bg-rose-600 text-white' : 'bg-vedic-gold/20 text-vedic-gold'
                        }`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span>{member.name}</span>
                            {member.role === 'Group Leader' && (
                              <span className="text-[10px] bg-saffron-prime/30 text-saffron-glow px-1.5 rounded">
                                Leader
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-white/50">{member.role}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        isSeparated
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isSeparated ? 'ALERT: SEPARATED' : 'SAFE NEARBY'}
                      </span>
                    </div>

                    {/* Telemetry info */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-white/70 py-1.5 border-t border-b border-white/5 my-2">
                      <div>
                        <span className="text-white/40 block text-[9px]">Distance:</span>
                        <span className={`font-bold ${isSeparated ? 'text-rose-400 text-sm' : 'text-emerald-400'}`}>
                          {member.distanceMeters} meters
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">Altitude:</span>
                        <span>{member.altitude}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">Heart Pulse:</span>
                        <span>{member.pulseBpm} BPM</span>
                      </div>
                    </div>

                    {/* Member Action: Ping buzzer */}
                    {member.id !== 'gm-1' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handlePingMember(member.id, member.name)}
                          disabled={!!pingState}
                          className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-200 text-[11px] font-medium flex items-center space-x-1.5 transition-all"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-vedic-gold" />
                          <span>{pingState || 'Send Loud Buzzer Ping'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
