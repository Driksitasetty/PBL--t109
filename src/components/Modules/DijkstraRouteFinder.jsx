// ============================================================
// DijkstraRouteFinder.jsx — Smart Route Finder Module
// ============================================================
// This module shows a temple checkpoint map and finds the
// shortest path using Dijkstra's Algorithm running in Flask.
//
// HOW IT WORKS:
// 1. User picks Source and Destination from dropdowns
// 2. User clicks "Find Shortest Route"
// 3. We send the request to Flask backend
// 4. Flask runs Dijkstra's algorithm and returns the path
// 5. We show the path on the SVG map and in the step list
// ============================================================

import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Zap, Clock, MapPin, Code, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getTempleNodes, findShortestRoute } from '../../services/api';

// Static fallback graph for when Flask is not running
// This allows the module to work in demo mode
const FALLBACK_NODES = [
  { id: 'ENTRY',         name: 'Main Entrance Gate',          x: 80,  y: 300 },
  { id: 'REGISTRATION',  name: 'Registration Counter',         x: 220, y: 300 },
  { id: 'TEMPLE_GATE',   name: 'Temple Gate (Dwara)',          x: 380, y: 200 },
  { id: 'DARSHAN_QUEUE', name: 'Darshan Queue Hall',           x: 520, y: 300 },
  { id: 'MEDICAL',       name: 'Medical Help Desk',            x: 380, y: 420 },
  { id: 'WATER_POINT',   name: 'Water Point & Rest',           x: 650, y: 200 },
  { id: 'REST_AREA',     name: 'Rest Area & Prasadam',         x: 650, y: 400 },
  { id: 'EXIT',          name: 'Exit Gate & Parking',          x: 820, y: 300 },
];

const FALLBACK_EDGES = [
  { from: 'ENTRY',         to: 'REGISTRATION',  distance: 80  },
  { from: 'REGISTRATION',  to: 'TEMPLE_GATE',   distance: 200 },
  { from: 'REGISTRATION',  to: 'MEDICAL',       distance: 150 },
  { from: 'TEMPLE_GATE',   to: 'DARSHAN_QUEUE', distance: 180 },
  { from: 'TEMPLE_GATE',   to: 'WATER_POINT',   distance: 300 },
  { from: 'DARSHAN_QUEUE', to: 'REST_AREA',     distance: 150 },
  { from: 'DARSHAN_QUEUE', to: 'EXIT',          distance: 350 },
  { from: 'WATER_POINT',   to: 'EXIT',          distance: 220 },
  { from: 'REST_AREA',     to: 'EXIT',          distance: 200 },
  { from: 'MEDICAL',       to: 'REST_AREA',     distance: 120 },
];

// Simple Dijkstra implementation for frontend demo mode
// When Flask is available, the backend runs this instead
function runDijkstraFrontend(nodes, edges, sourceId, targetId) {
  // Step 1: Set all distances to Infinity (unknown)
  const distances = {};
  const previous = {};
  const unvisited = new Set(nodes.map(n => n.id));

  nodes.forEach(n => { distances[n.id] = Infinity; previous[n.id] = null; });
  distances[sourceId] = 0;

  // Step 2: Repeat until all nodes are visited
  while (unvisited.size > 0) {
    // Pick the unvisited node with the smallest known distance
    let closest = null;
    for (const id of unvisited) {
      if (closest === null || distances[id] < distances[closest]) closest = id;
    }

    if (distances[closest] === Infinity) break; // No more reachable nodes
    if (closest === targetId) break;             // Reached destination!

    unvisited.delete(closest);

    // Step 3: Update distances to all neighbors
    edges.forEach(edge => {
      let neighbor = null;
      if (edge.from === closest) neighbor = edge.to;
      else if (edge.to === closest) neighbor = edge.from; // Bidirectional

      if (neighbor && unvisited.has(neighbor)) {
        const newDist = distances[closest] + edge.distance;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = closest; // Remember: we came from 'closest'
        }
      }
    });
  }

  // Step 4: Trace back the path from destination to source
  const path = [];
  let current = targetId;
  while (current !== null) { path.unshift(current); current = previous[current]; }

  // Build step-by-step directions
  const steps = [];
  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find(e =>
      (e.from === path[i] && e.to === path[i + 1]) ||
      (e.to === path[i] && e.from === path[i + 1])
    );
    steps.push({ from: path[i], to: path[i + 1], distance: edge ? edge.distance : 0 });
  }

  return {
    path: path[0] === sourceId ? path : [],
    totalDistance: distances[targetId] === Infinity ? 0 : distances[targetId],
    steps
  };
}

export default function SmartRouteFinder() {
  const [sourceNode,   setSourceNode]   = useState('ENTRY');
  const [targetNode,   setTargetNode]   = useState('EXIT');
  const [routeResult,  setRouteResult]  = useState(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [backendMode,  setBackendMode]  = useState('demo'); // 'flask' | 'demo'
  const [showCodeModal,setShowCodeModal]= useState(false);
  const [error,        setError]        = useState('');

  const nodes = FALLBACK_NODES;
  const edges = FALLBACK_EDGES;

  // On first load, run demo route
  useEffect(() => {
    handleFindRoute('ENTRY', 'EXIT');
  }, []);

  // Find the shortest route — tries Flask first, falls back to demo
  async function handleFindRoute(src = sourceNode, dest = targetNode) {
    if (src === dest) { setError('Source and destination cannot be the same!'); return; }
    setError('');
    setIsLoading(true);

    // Try Flask backend first
    const { data, error: apiError } = await findShortestRoute(src, dest);

    if (!apiError && data && data.success) {
      // ✅ Flask backend is running — use real result
      setRouteResult(data);
      setBackendMode('flask');
    } else {
      // ⚠️ Flask not running — use frontend demo mode
      const result = runDijkstraFrontend(nodes, edges, src, dest);
      setRouteResult({ ...result, success: true });
      setBackendMode('demo');
    }

    setIsLoading(false);
  }

  // Check if an edge is part of the shortest path (for highlighting)
  function isEdgeHighlighted(fromId, toId) {
    if (!routeResult?.path || routeResult.path.length < 2) return false;
    for (let i = 0; i < routeResult.path.length - 1; i++) {
      const a = routeResult.path[i], b = routeResult.path[i + 1];
      if ((a === fromId && b === toId) || (a === toId && b === fromId)) return true;
    }
    return false;
  }

  function isNodeInPath(nodeId) {
    return routeResult?.path?.includes(nodeId);
  }

  return (
    <div className="space-y-6">

      {/* Module Header */}
      <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-vedic-gold text-xs font-mono mb-1">
              <span className="bg-saffron-prime/20 px-2 py-0.5 rounded border border-saffron-prime/30">MODULE 2</span>
              <span>GRAPH + DIJKSTRA'S SHORTEST PATH ALGORITHM</span>
              {/* Show whether we're using Flask or demo mode */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                backendMode === 'flask'
                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
              }`}>
                {backendMode === 'flask' ? '🟢 Flask Connected' : '🟡 Demo Mode'}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-vedic text-white">Smart Route Finder (लघुतम मार्ग सेतु)</h2>
            <p className="text-xs text-amber-100/70 mt-1 max-w-2xl">
              Uses <strong>Dijkstra's Algorithm</strong> to find the shortest path through temple checkpoints.
              The algorithm explores all possible routes and guarantees the absolute shortest distance.
              {backendMode === 'demo' && ' (Start Flask backend to use server-side calculation)'}
            </p>
          </div>
          <button
            onClick={() => setShowCodeModal(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-vedic-gold/40 text-vedic-gold hover:bg-amber-500/20 text-xs font-mono transition-all"
          >
            <Code className="w-4 h-4" />
            <span>How Dijkstra Works</span>
          </button>
        </div>
      </div>

      {/* Route Selection Controls */}
      <div className="sacred-glass rounded-2xl p-5 border border-vedic-gold/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          <div className="md:col-span-4">
            <label className="text-[11px] font-semibold text-amber-200 block mb-1">🚩 Start Point:</label>
            <select
              value={sourceNode}
              onChange={(e) => { setSourceNode(e.target.value); handleFindRoute(e.target.value, targetNode); }}
              className="w-full bg-black/60 border border-vedic-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-vedic-gold"
            >
              {nodes.map(n => <option key={n.id} value={n.id} className="bg-temple-dark">{n.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="text-[11px] font-semibold text-amber-200 block mb-1">🎯 Destination:</label>
            <select
              value={targetNode}
              onChange={(e) => { setTargetNode(e.target.value); handleFindRoute(sourceNode, e.target.value); }}
              className="w-full bg-black/60 border border-vedic-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-vedic-gold"
            >
              {nodes.map(n => <option key={n.id} value={n.id} className="bg-temple-dark">{n.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-4 flex items-end">
            <button
              onClick={() => handleFindRoute()}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron-prime to-amber-600 text-white font-bold text-xs shadow-lg hover:brightness-110 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isLoading ? 'Calculating...' : 'Find Shortest Route'}</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-center space-x-2 text-xs text-rose-300 bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick preset buttons */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-white/50 text-[11px]">Quick Scenarios:</span>
          <button onClick={() => { setSourceNode('ENTRY'); setTargetNode('EXIT'); handleFindRoute('ENTRY', 'EXIT'); }}
            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-amber-100 hover:border-vedic-gold text-[11px]">
            Main Entrance → Exit
          </button>
          <button onClick={() => { setSourceNode('ENTRY'); setTargetNode('MEDICAL'); handleFindRoute('ENTRY', 'MEDICAL'); }}
            className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-rose-300 text-[11px]">
            Emergency → Medical Help
          </button>
          <button onClick={() => { setSourceNode('REGISTRATION'); setTargetNode('DARSHAN_QUEUE'); handleFindRoute('REGISTRATION', 'DARSHAN_QUEUE'); }}
            className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
            Registration → Darshan Queue
          </button>
        </div>
      </div>

      {/* SVG Graph Visualization */}
      <div className="sacred-glass rounded-2xl p-6 border border-vedic-gold/25">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-saffron-glow" />
            <h3 className="text-sm font-bold text-vedic-gold">Temple Checkpoint Map — Dijkstra Path Highlighted</h3>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-vedic-gold inline-block"></span>
              <span className="text-amber-300">Shortest Path</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-white/30 inline-block"></span>
              <span className="text-white/40">Other Routes</span>
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-black/60 rounded-2xl p-4 border border-white/5">
          <svg viewBox="0 0 920 520" className="w-full h-auto select-none min-w-[600px]">
            {/* Draw all edges */}
            {edges.map((edge, idx) => {
              const nodeA = nodes.find(n => n.id === edge.from);
              const nodeB = nodes.find(n => n.id === edge.to);
              if (!nodeA || !nodeB) return null;
              const highlighted = isEdgeHighlighted(edge.from, edge.to);
              const midX = (nodeA.x + nodeB.x) / 2;
              const midY = (nodeA.y + nodeB.y) / 2;
              return (
                <g key={idx}>
                  <line x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y}
                    stroke={highlighted ? '#D4AF37' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={highlighted ? 4 : 1.5}
                    strokeDasharray={highlighted ? '8 4' : 'none'}
                    className={highlighted ? 'animate-pulse' : ''}
                  />
                  <rect x={midX - 20} y={midY - 9} width="40" height="16" rx="3"
                    fill={highlighted ? '#380B14' : '#120508'}
                    stroke={highlighted ? '#D4AF37' : '#333'} strokeWidth="1"
                  />
                  <text x={midX} y={midY + 3} textAnchor="middle"
                    fill={highlighted ? '#F5D77F' : '#777'} fontSize="9" fontFamily="monospace">
                    {edge.distance}m
                  </text>
                </g>
              );
            })}

            {/* Draw all nodes */}
            {nodes.map(node => {
              const isSource = node.id === sourceNode;
              const isTarget = node.id === targetNode;
              const inPath   = isNodeInPath(node.id);
              const fill     = isSource ? '#FF6F00' : isTarget ? '#10B981' : inPath ? '#380B14' : '#1A0B0E';
              const stroke   = isSource || isTarget ? '#FFF' : inPath ? '#D4AF37' : 'rgba(212,175,55,0.4)';
              return (
                <g key={node.id} className="cursor-pointer" onClick={() => { setTargetNode(node.id); handleFindRoute(sourceNode, node.id); }}>
                  <circle cx={node.x} cy={node.y} r={inPath ? 22 : 18} fill={fill} stroke={stroke} strokeWidth={inPath ? 3 : 1.5} />
                  {(isSource || isTarget) && (
                    <circle cx={node.x} cy={node.y} r="28" fill="none" stroke={isSource ? '#FF6F00' : '#10B981'} strokeWidth="2" className="animate-ping" opacity="0.4" />
                  )}
                  <text x={node.x} y={node.y + 3} textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    {node.id.substring(0, 4)}
                  </text>
                  <text x={node.x} y={node.y + 33} textAnchor="middle" fill={inPath ? '#FDE68A' : '#9CA3AF'} fontSize="9">
                    {node.name.split(' ').slice(0, 2).join(' ')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Result Stats Cards */}
      {routeResult && routeResult.path && routeResult.path.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="sacred-glass rounded-2xl p-4 border border-vedic-gold/20 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-vedic-gold" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-white/50 block">Total Distance</span>
                <span className="text-xl font-bold font-mono text-vedic-gold">{routeResult.totalDistance} m</span>
              </div>
            </div>
            <div className="sacred-glass rounded-2xl p-4 border border-vedic-gold/20 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-saffron-glow" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-white/50 block">Est. Walking Time</span>
                <span className="text-xl font-bold font-mono text-saffron-glow">~{Math.ceil(routeResult.totalDistance / 60)} min</span>
              </div>
            </div>
            <div className="sacred-glass rounded-2xl p-4 border border-vedic-gold/20 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-white/50 block">Checkpoints</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{routeResult.path.length - 1} stops</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Path */}
          <div className="sacred-glass rounded-2xl p-5 border border-vedic-gold/20">
            <h4 className="text-xs font-bold text-vedic-gold uppercase tracking-wider mb-3">
              📍 Step-by-Step Route:
            </h4>
            <div className="space-y-2">
              {routeResult.steps && routeResult.steps.map((step, idx) => {
                const fromNode = nodes.find(n => n.id === step.from);
                const toNode   = nodes.find(n => n.id === step.to);
                return (
                  <div key={idx} className="flex items-center space-x-3 text-xs">
                    <span className="font-mono text-vedic-gold w-5 text-right">{idx + 1}.</span>
                    <span className="text-amber-200">{fromNode?.name || step.from}</span>
                    <span className="text-vedic-gold">→</span>
                    <span className="text-amber-100">{toNode?.name || step.to}</span>
                    <span className="text-white/40 font-mono ml-auto">{step.distance}m</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Algorithm Explanation Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="sacred-glass max-w-2xl w-full rounded-3xl p-6 border-2 border-vedic-gold shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowCodeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white">✕</button>
            <div className="flex items-center space-x-2 text-vedic-gold mb-2 font-mono text-xs">
              <Code className="w-4 h-4" />
              <span>DIJKSTRA'S ALGORITHM — SIMPLE EXPLANATION</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">How the Shortest Path Is Found</h3>
            <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed">
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <p className="text-emerald-400 font-bold mb-1">Step 1 — Set All Distances to Unknown</p>
                <p>We start by saying every checkpoint is "infinitely far" except our starting point, which is distance 0.</p>
                <p className="font-mono text-amber-300 mt-1">distances = &#123; ENTRY: 0, all others: Infinity &#125;</p>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <p className="text-emerald-400 font-bold mb-1">Step 2 — Always Pick the Nearest Unvisited Checkpoint</p>
                <p>Look at all checkpoints we haven't visited yet. Pick the one with the smallest known distance. Visit it next.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <p className="text-emerald-400 font-bold mb-1">Step 3 — Update Neighbor Distances</p>
                <p>For every checkpoint connected to the one we just visited, check: "Is our new path shorter than what we knew before?" If yes, update it.</p>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                <p className="text-emerald-400 font-bold mb-1">Step 4 — Trace Back the Path</p>
                <p>Once we reach the destination, we trace backwards using the "previous" pointer to reconstruct the exact route taken.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-950/40 rounded-xl border border-vedic-gold/30 text-xs text-amber-100">
              <p className="font-bold text-vedic-gold mb-1">🎓 Say to Teacher:</p>
              <p><em>"Dijkstra's Algorithm is a greedy algorithm. It always picks the closest unvisited node next. This guarantees the shortest distance path. Time complexity is O(V²) where V is the number of checkpoints (vertices)."</em></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
