// Temple Network Graph Data for Smart Route Finder (Using Dijkstra's Algorithm internally)
// Modeled around high-density pilgrim sites (Kedarnath / Tirumala / Vaishno Devi)

export const TEMPLE_NODES = [
  { id: 'ENTRY', name: 'South Gopuram (Main Entrance)', type: 'entry', x: 80, y: 320, icon: 'DoorOpen' },
  { id: 'SECURITY', name: 'Biometric Frisking & Cloakroom', type: 'checkpoint', x: 220, y: 320, icon: 'ShieldCheck' },
  { id: 'QUEUE_GEN', name: 'Sarva Darshan Queue Hall A', type: 'queue', x: 380, y: 200, icon: 'Users' },
  { id: 'QUEUE_FAST', name: 'Special Darshan Line (Vedic Pass)', type: 'queue', x: 380, y: 440, icon: 'Zap' },
  { id: 'MED_CAMP', name: 'High-Altitude Oxygen & First Aid Post', type: 'medical', x: 500, y: 80, icon: 'HeartPulse' },
  { id: 'INNER_MANDAP', name: 'Maha Mandapam (Inner Courtyard)', type: 'checkpoint', x: 600, y: 320, icon: 'Compass' },
  { id: 'GARBHAGRIHA', name: 'Garbhagriha (Sanctum Sanctorum)', type: 'sanctum', x: 780, y: 320, icon: 'Sparkles' },
  { id: 'PRASADAM', name: 'Laddu Prasadam & Annadanam Hub', type: 'facility', x: 680, y: 480, icon: 'Gift' },
  { id: 'EMERGENCY_EXIT', name: 'Emergency Evacuation Corridor', type: 'exit', x: 620, y: 160, icon: 'AlertOctagon' },
  { id: 'EXIT_NORTH', name: 'North Exit Gate & Pilgrim Transit', type: 'exit', x: 920, y: 320, icon: 'LogOut' }
];

export const TEMPLE_EDGES = [
  { from: 'ENTRY', to: 'SECURITY', distance: 120, crowdDensity: 'Moderate', timeMin: 3 },
  { from: 'SECURITY', to: 'QUEUE_GEN', distance: 250, crowdDensity: 'Heavy', timeMin: 18 },
  { from: 'SECURITY', to: 'QUEUE_FAST', distance: 180, crowdDensity: 'Low', timeMin: 6 },
  { from: 'QUEUE_GEN', to: 'MED_CAMP', distance: 150, crowdDensity: 'Low', timeMin: 4 },
  { from: 'MED_CAMP', to: 'INNER_MANDAP', distance: 200, crowdDensity: 'Moderate', timeMin: 5 },
  { from: 'QUEUE_GEN', to: 'INNER_MANDAP', distance: 280, crowdDensity: 'Very Heavy', timeMin: 25 },
  { from: 'QUEUE_FAST', to: 'INNER_MANDAP', distance: 210, crowdDensity: 'Moderate', timeMin: 8 },
  { from: 'INNER_MANDAP', to: 'GARBHAGRIHA', distance: 90, crowdDensity: 'Extreme', timeMin: 12 },
  { from: 'GARBHAGRIHA', to: 'PRASADAM', distance: 160, crowdDensity: 'Heavy', timeMin: 7 },
  { from: 'GARBHAGRIHA', to: 'EXIT_NORTH', distance: 190, crowdDensity: 'Moderate', timeMin: 5 },
  { from: 'PRASADAM', to: 'EXIT_NORTH', distance: 220, crowdDensity: 'Moderate', timeMin: 6 },
  { from: 'INNER_MANDAP', to: 'EMERGENCY_EXIT', distance: 110, crowdDensity: 'Clear', timeMin: 2 },
  { from: 'EMERGENCY_EXIT', to: 'EXIT_NORTH', distance: 260, crowdDensity: 'Clear', timeMin: 5 },
];

// =======================================================================
// SMART ROUTE FINDER — Dijkstra's Shortest Path Algorithm
//
// How to explain to teacher:
// 1. Each temple checkpoint is a NODE (vertex) in a graph
// 2. Each pathway between checkpoints is an EDGE with a distance (weight)
// 3. We start from the source gate and keep picking the NEAREST unvisited node
// 4. We update distances to all neighbors if a shorter path is found
// 5. This guarantees the absolute shortest distance route
// Time Complexity: O(V²) — V = number of checkpoints
// =======================================================================
export function runDijkstra(startNodeId, targetNodeId) {
  // Step 1: Set all distances to Infinity (unknown), source = 0
  const distances = {};
  const previous = {};
  const unvisited = new Set(TEMPLE_NODES.map(n => n.id));

  TEMPLE_NODES.forEach(n => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
  });
  distances[startNodeId] = 0;

  // Step 2: Keep looping until all nodes visited
  while (unvisited.size > 0) {
    // Pick the unvisited node with the smallest known distance
    let closestNode = null;
    for (const node of unvisited) {
      if (closestNode === null || distances[node] < distances[closestNode]) {
        closestNode = node;
      }
    }

    if (closestNode === null || distances[closestNode] === Infinity) break;
    if (closestNode === targetNodeId) break; // Reached destination!

    unvisited.delete(closestNode);

    // Step 3: Check all neighbors and update their distances if shorter path found
    TEMPLE_EDGES.forEach(edge => {
      let neighbor = null;
      if (edge.from === closestNode) neighbor = edge.to;
      else if (edge.to === closestNode) neighbor = edge.from;

      if (neighbor && unvisited.has(neighbor)) {
        const newDist = distances[closestNode] + edge.distance;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = closestNode; // Remember how we got here
        }
      }
    });
  }

  // Step 4: Trace back the shortest path from destination to source
  const path = [];
  let curr = targetNodeId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return {
    path: path[0] === startNodeId ? path : [],
    totalDistance: distances[targetNodeId] === Infinity ? 0 : distances[targetNodeId]
  };
}
