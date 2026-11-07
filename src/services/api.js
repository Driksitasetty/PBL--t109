// ============================================================
// api.js — All Flask Backend API Calls in One Place
// ============================================================
// This file contains all the functions that talk to our
// Python Flask backend server (running on port 5000).
//
// HOW IT WORKS:
// 1. React component calls a function from here (e.g. getRoute)
// 2. This function sends an HTTP request to Flask using fetch()
// 3. Flask runs the algorithm and sends back JSON data
// 4. We return that data to the React component
// ============================================================

// The base URL of our Flask backend server
// In development: Flask runs on port 5000
const FLASK_URL = 'http://localhost:5000';

// ── HELPER FUNCTION ──────────────────────────────────────────
// A simple wrapper around fetch() that handles errors
// Returns { data, error } — always check error first!
async function callFlask(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
    };

    // Only add body for POST/PUT requests
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${FLASK_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      // Server returned an error (4xx or 5xx status code)
      return { data: null, error: data.error || 'Server error occurred' };
    }

    return { data, error: null };
  } catch (err) {
    // Network error — Flask server is probably not running
    return {
      data: null,
      error: 'Cannot connect to backend. Make sure Flask is running on port 5000.'
    };
  }
}

// ── MODULE 1: LOST PERSON FINDER ─────────────────────────────

// Get all active lost person reports
export async function getLostPersonReports() {
  return callFlask('/api/lost-persons');
}

// Submit a new lost person report
// reportData = { name, age, lastSeen, description, contactName, contactPhone }
export async function reportLostPerson(reportData) {
  return callFlask('/api/report-lost-person', 'POST', reportData);
}

// Compare two images for similarity (image matching)
// Both params are base64 encoded image strings
export async function matchImages(image1Base64, image2Base64) {
  return callFlask('/api/match-image', 'POST', {
    image1: image1Base64,
    image2: image2Base64
  });
}

// ── MODULE 2: ROUTE FINDER (DIJKSTRA) ────────────────────────

// Get all temple checkpoint names (for dropdown menus)
export async function getTempleNodes() {
  return callFlask('/api/temples');
}

// Find shortest path between two temple checkpoints
// source and destination are node IDs like 'ENTRY', 'EXIT'
export async function findShortestRoute(source, destination) {
  return callFlask('/api/route', 'POST', { source, destination });
}

// ── MODULE 3: HEALTH RISK PREDICTOR ──────────────────────────

// Get information about the ML model (accuracy, features)
export async function getHealthModelInfo() {
  return callFlask('/api/health-model-info');
}

// Predict health risk based on user's health information
// features = { age_group, altitude_category, exertion_level,
//              has_heart_condition, has_breathing_issues, is_diabetic }
export async function predictHealthRisk(features) {
  return callFlask('/api/predict-health-risk', 'POST', features);
}

// ── MODULE 4: GROUP TRACKING ───────────────────────────────────

// Create a new group (returns group code and ID)
// leaderName = string
export async function createGroup(leaderName, groupName, pilgrimSite) {
  return callFlask('/api/groups/create', 'POST', { leaderName, groupName, pilgrimSite });
}

// Join an existing group using the code
export async function joinGroup(groupCode, memberName) {
  return callFlask('/api/groups/join', 'POST', { groupCode, memberName });
}

// Get all members of a group with their locations
export async function getGroupMembers(groupId) {
  return callFlask(`/api/groups/${groupId}/members`);
}

// Update a member's GPS location
export async function updateMemberLocation(groupId, memberId, lat, lng) {
  return callFlask(`/api/groups/${groupId}/update-location`, 'POST', {
    memberId, lat, lng
  });
}

// Check if any group member has been separated (>150m from leader)
export async function checkGroupAlerts(groupId) {
  return callFlask(`/api/groups/${groupId}/alerts`);
}

// ── MODULE 5: GUIDE VERIFICATION ──────────────────────────────

// Get all guides in the directory
export async function getAllGuides() {
  return callFlask('/api/guides');
}

// Search guides by name or badge ID
export async function searchGuides(query) {
  return callFlask(`/api/guides/search?q=${encodeURIComponent(query)}`);
}

// Submit a fraud report about a guide
// reportData = { guideName, reporterName, description, reportType }
export async function reportSuspiciousGuide(reportData) {
  return callFlask('/api/report-guide', 'POST', reportData);
}

// ── HEALTH CHECK ───────────────────────────────────────────────

// Check if Flask backend is running — used on app startup
export async function checkBackendHealth() {
  return callFlask('/health');
}
