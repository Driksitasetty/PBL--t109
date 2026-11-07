

export const SYSTEM_INFO = {
  projectTitle: "DarshanSetu: Smart pilgrim safety system",
  version: "v2.0",
  platform: "Smart Pilgrim Safety System",
  networkStatus: "Active Online"
};


export const TEAM_INFO = SYSTEM_INFO;


export const INITIAL_LOST_PERSONS = [
  {
    id: "LP-1042",
    name: "Driksita setty",
    age: 68,
    gender: "Female",
    clothing: "orange kurti",
    reportedBy: "kusum sapra (friend)",
    reportedTime: "12 mins ago",
    status: "LOCATED",
    matchConfidence: 94.6,
    lastSeenLocation: "Medical Camp 2 (Near Maha stupa)",
    cameraSource: "CCTV Cam #14 - South Corridor",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    notes: "Suffering from mild hypertension. Located resting at medical post."
  },
  {
    id: "LP-1043",
    name: "pranav Gupta",
    age: 9,
    gender: "Male",
    clothing: "Yellow T-shirt & Blue Jeans",
    reportedBy: "Vikram Gupta (Father)",
    reportedTime: "34 mins ago",
    status: "SEARCHING",
    matchConfidence: 89.2,
    lastSeenLocation: "Queue Complex Hall B - Gate 4",
    cameraSource: "CCTV Cam #08 - Queue Entry",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    notes: "Separated during crowd surge at aarti."
  },
  {
    id: "LP-1044",
    name: "Kalyani Devi",
    age: 72,
    gender: "Female",
    clothing: "Red Banarasi Saree, Rudraksha Mala",
    reportedBy: "Manoj Kumar (Son)",
    reportedTime: "5 mins ago",
    status: "PROCESSING_MATCH",
    matchConfidence: 91.8,
    lastSeenLocation: "Annadanam Hall Exit",
    cameraSource: "CCTV Cam #22 - Prasadam Wing",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    notes: "Hearing impairment; temple staff alerted."
  }
];

// Group Tracking Live Simulation Data
export const MOCK_GROUP_MEMBERS = [
  { id: 'gm-1', name: 'You (Pilgrim Lead)', role: 'Group Leader', distanceMeters: 0, battery: '88%', status: 'Safe', pulseBpm: 76, altitude: '3,583 m' },
  { id: 'gm-2', name: 'Grandfather (Ram Nath)', role: 'Senior Citizen', distanceMeters: 18, battery: '42%', status: 'Safe', pulseBpm: 92, altitude: '3,582 m' },
  { id: 'gm-3', name: 'Aarav (Child)', role: 'Family Member', distanceMeters: 28, battery: '79%', status: 'Safe', pulseBpm: 88, altitude: '3,584 m' },
  { id: 'gm-4', name: 'Meera (Family Member)', role: 'Separated Member', distanceMeters: 145, battery: '31%', status: 'SEPARATION ALERT', pulseBpm: 104, altitude: '3,570 m' }
];


export const GUIDES_DATABASE = [
  {
    id: "GD-8841",
    name: "Pandit Radhe Shyam Tiwari",
    badgeNumber: "UK-KEDAR-8841",
    registeredBoard: "Badri-Kedar Temple Committee (BKTC)",
    experience: "14 Years",
    rating: 4.9,
    status: "VERIFIED_OFFICIAL",
    languages: ["Hindi", "Sanskrit", "Garhwali", "English"],
    verifiedDate: "Jan 2026",
    idPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    approvedFeePerPilgrim: "₹350 (Official Govt Cap)",
    notes: "Official registered guide with authorized biometric identity card."
  },
  {
    id: "GD-7210",
    name: "Mahesh Chandra Pant",
    badgeNumber: "UK-KEDAR-7210",
    registeredBoard: "Char Dham Devasthanam Board",
    experience: "8 Years",
    rating: 4.8,
    status: "VERIFIED_OFFICIAL",
    languages: ["Hindi", "Bengali", "Gujarati"],
    verifiedDate: "Nov 2025",
    idPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    approvedFeePerPilgrim: "₹300 (Official Govt Cap)",
    notes: "Certified high-altitude safety first responder."
  },
  {
    id: "GD-FAKE-09",
    name: "Raju 'Vaidya' Verma (Alias)",
    badgeNumber: "FAKE-UK-9921",
    registeredBoard: "UNAUTHORIZED / NONE",
    experience: "Unknown",
    rating: 1.2,
    status: "BLACKLISTED_FRAUD",
    languages: ["Hindi"],
    verifiedDate: "Flagged Sept 2025",
    idPhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    approvedFeePerPilgrim: "Demands ₹2,500 - ₹5,000 illegally",
    notes: "CAUTION: Reported for demanding fake VIP pass money and misleading pilgrims away from official queues."
  },
  {
    id: "GD-FAKE-12",
    name: "Devendra Singh Rawat (Unlicensed)",
    badgeNumber: "NONE - EXPIRED",
    registeredBoard: "Revoked by Police",
    experience: "1 Year",
    rating: 1.5,
    status: "BLACKLISTED_FRAUD",
    languages: ["Hindi"],
    verifiedDate: "Banned 2025",
    idPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    approvedFeePerPilgrim: "Scam alerts active",
    notes: "Selling forged priority darshan tokens. Turn over to temple security if spotted."
  }
];


export const HEALTH_CONDITIONS_RISK = [
  { condition: "Oxygen Saturation (SpO2) < 85%", severity: "Critical Risk", advice: "Immediate High Altitude Hypoxia danger. Proceed to nearest Oxygen Tent at Medical Camp 2 immediately. Do not ascend further." },
  { condition: "Blood Pressure > 150/95 with Nausea", severity: "High Risk", advice: "Acute Mountain Sickness (AMS) onset detected. Halt trek, hydrate with Electral/ORS, avoid sudden physical exertion." },
  { condition: "Severe Dizziness & Breathlessness in Crowd", severity: "High Risk", advice: "Crowd suffocation risk. Exit dense queue via Emergency Evacuation Corridor (Gate 2B) and take deep slow breaths." },
  { condition: "Mild Headache & Dehydration", severity: "Moderate", advice: "Take warm ginger tea or glucose water. Rest for 20 minutes before continuing darshan line." },
  { condition: "Normal Vitals (SpO2 > 92%, BP Normal)", severity: "Healthy", advice: "You are fit for Darshan. Stay well-hydrated in cold climate and keep warm clothing on." }
];

export const HELPLINE_CONTACTS = [
  { name: "National Disaster Relief (NDRF) Yatra Unit", number: "1078", type: "Disaster" },
  { name: "Police Emergency Pilgrim Helpline", number: "112", type: "Police" },
  { name: "Char Dham / Kedarnath Medical Emergency", number: "108", type: "Medical" },
  { name: "Temple Lost & Found Central Control Room", number: "+91 135 2741600", type: "Temple Help" },
  { name: "Anti-Fraud & Scam Reporting Cell", number: "+91 135 2430015", type: "Vigilance" }
];
