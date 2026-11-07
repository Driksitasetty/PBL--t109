// ============================================================
// Firestore Service — All Database Read/Write Operations
// ============================================================
// This single file handles ALL Firestore operations for:
//  - Lost Person Reports (Module 1)
//  - Route History (Module 2)
//  - Health Records (Module 3)
//  - Group Tracking (Module 4)
//  - Guide Registry (Module 5)
//  - SOS Emergency Alerts
// ============================================================

import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// ── MODULE 1: LOST PERSON FINDER ─────────────────────────────

// Save a new lost person report to Firestore
export async function saveLostPersonReport(reportData) {
  return await addDoc(collection(db, 'lost_persons'), {
    ...reportData,
    status: 'searching',    // 'searching' | 'found' | 'closed'
    reportedAt: serverTimestamp()
  });
}

// Get all active lost person reports (for staff dashboard)
export async function getLostPersonReports() {
  const q = query(
    collection(db, 'lost_persons'),
    where('status', '==', 'searching'),
    orderBy('reportedAt', 'desc'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Update status of a lost person report (when found)
export async function updateLostPersonStatus(reportId, status, locationFound = '') {
  await updateDoc(doc(db, 'lost_persons', reportId), {
    status,
    locationFound,
    updatedAt: serverTimestamp()
  });
}

// Listen in real-time to lost person reports (live updates)
export function listenToLostPersons(callback) {
  const q = query(
    collection(db, 'lost_persons'),
    where('status', '==', 'searching'),
    orderBy('reportedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(reports);
  });
}

// ── MODULE 2: ROUTE FINDER HISTORY ────────────────────────────

// Save a route search to history (optional analytics)
export async function saveRouteSearch(userId, sourceId, targetId, path, distanceMeters) {
  return await addDoc(collection(db, 'route_history'), {
    userId,
    sourceId,
    targetId,
    path,
    distanceMeters,
    searchedAt: serverTimestamp()
  });
}

// ── MODULE 3: HEALTH / MEDICAL RECORDS ────────────────────────

// Save a health assessment result for a pilgrim
export async function saveHealthRecord(userId, vitals, riskLevel, advice) {
  return await addDoc(collection(db, 'health_records'), {
    userId,
    vitals,        // { age, spo2, bloodPressure, heartRate, nausea }
    riskLevel,     // 'SAFE' | 'MODERATE' | 'CRITICAL'
    advice,
    assessedAt: serverTimestamp()
  });
}

// Get health records for a specific user
export async function getUserHealthRecords(userId) {
  const q = query(
    collection(db, 'health_records'),
    where('userId', '==', userId),
    orderBy('assessedAt', 'desc'),
    limit(10)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── MODULE 4: GROUP TRACKING ───────────────────────────────────

// Create a new group (family/friends group at pilgrim site)
export async function createGroup(leaderId, leaderName, groupName, pilgrimSite) {
  const groupRef = await addDoc(collection(db, 'groups'), {
    leaderId,
    leaderName,
    groupName,
    pilgrimSite,
    memberCount: 1,
    createdAt: serverTimestamp()
  });

  // Add the leader as first member
  await setDoc(doc(db, 'groups', groupRef.id, 'members', leaderId), {
    name: leaderName,
    role: 'leader',
    latDeg: 30.7346,   // Default: Kedarnath GPS
    lngDeg: 79.0669,
    distanceFromLeaderMeters: 0,
    isAlert: false,
    lastUpdated: serverTimestamp()
  });

  return groupRef.id;
}

// Add a member to an existing group
export async function addGroupMember(groupId, memberId, memberName) {
  await setDoc(doc(db, 'groups', groupId, 'members', memberId), {
    name: memberName,
    role: 'member',
    latDeg: 30.7346,
    lngDeg: 79.0669,
    distanceFromLeaderMeters: 0,
    isAlert: false,
    lastUpdated: serverTimestamp()
  });
  // Increment member count on group document
  await updateDoc(doc(db, 'groups', groupId), {
    memberCount: (await getDoc(doc(db, 'groups', groupId))).data().memberCount + 1
  });
}

// Update a member's GPS location
export async function updateMemberLocation(groupId, memberId, lat, lng, distanceMeters) {
  const isAlert = distanceMeters > 150;  // Alert if more than 150m from leader
  await updateDoc(doc(db, 'groups', groupId, 'members', memberId), {
    latDeg: lat,
    lngDeg: lng,
    distanceFromLeaderMeters: distanceMeters,
    isAlert,
    lastUpdated: serverTimestamp()
  });
}

// Listen to group members in real-time (live GPS updates)
export function listenToGroupMembers(groupId, callback) {
  return onSnapshot(
    collection(db, 'groups', groupId, 'members'),
    (snapshot) => {
      const members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(members);
    }
  );
}

// ── MODULE 5: GUIDE VERIFICATION ──────────────────────────────

// Add an official guide to the registry (done by Admin/Staff)
export async function addGuide(guideData) {
  return await setDoc(doc(db, 'guides', guideData.badgeId), {
    ...guideData,
    status: 'verified',   // 'verified' | 'blacklisted'
    registeredAt: serverTimestamp()
  });
}

// Search for a guide by badge ID or name
export async function searchGuide(badgeId) {
  const docSnap = await getDoc(doc(db, 'guides', badgeId));
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
}

// Get all guides (for staff to manage)
export async function getAllGuides() {
  const snapshot = await getDocs(collection(db, 'guides'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Blacklist a fraudulent guide
export async function blacklistGuide(badgeId, reason) {
  await updateDoc(doc(db, 'guides', badgeId), {
    status: 'blacklisted',
    blacklistReason: reason,
    blacklistedAt: serverTimestamp()
  });
}

// ── SOS EMERGENCY ALERTS ───────────────────────────────────────

// Send an SOS emergency alert to Firestore
export async function sendSOSAlert(userId, userName, location, message) {
  return await addDoc(collection(db, 'sos_alerts'), {
    userId,
    userName,
    location,      // { lat, lng, altitudeMeters, landmark }
    message,
    status: 'active',   // 'active' | 'resolved'
    sentAt: serverTimestamp()
  });
}

// Listen to active SOS alerts in real-time (for staff dashboard)
export function listenToSOSAlerts(callback) {
  const q = query(
    collection(db, 'sos_alerts'),
    where('status', '==', 'active'),
    orderBy('sentAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(alerts);
  });
}

// Resolve an SOS alert (mark as handled by staff)
export async function resolveSOSAlert(alertId) {
  await updateDoc(doc(db, 'sos_alerts', alertId), {
    status: 'resolved',
    resolvedAt: serverTimestamp()
  });
}
