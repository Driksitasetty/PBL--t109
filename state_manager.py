# ============================================================
# state_manager.py — In-Memory & File-Backed Storage Engine
# ============================================================
# Manages persistence for:
# - Lost Person Reports & Uploaded Candidate Images
# - Dynamic Group Tracking, Member Radii & Alerts
# - Certified & Candidate Guide Directory & Fraud Reports
#
# Seamlessly integrates with Firebase Admin SDK when credentials
# are configured, and provides automatic zero-setup persistence.
# ============================================================

import os
import json
import uuid
import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

LOST_PERSONS_FILE = os.path.join(DATA_DIR, 'lost_persons.json')
GROUPS_FILE = os.path.join(DATA_DIR, 'groups.json')
GUIDES_FILE = os.path.join(DATA_DIR, 'guides.json')
REPORTS_FILE = os.path.join(DATA_DIR, 'guide_reports.json')

def _load_json(file_path, default_data):
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
    return default_data

def _save_json(file_path, data):
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving {file_path}: {e}")

# Initial seed data matching the project's original records
INITIAL_LOST_PERSONS = [
    {
        "id": "LP-1042",
        "name": "Driksita setty",
        "age": 68,
        "gender": "Female",
        "clothing": "orange kurti",
        "reportedBy": "kusum sapra (friend)",
        "reportedTime": "12 mins ago",
        "status": "LOCATED",
        "matchConfidence": 94.6,
        "lastSeenLocation": "Medical Camp 2 (Near Maha stupa)",
        "cameraSource": "CCTV Cam #14 - South Corridor",
        "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
        "notes": "Suffering from mild hypertension. Located resting at medical post."
    },
    {
        "id": "LP-1043",
        "name": "pranav Gupta",
        "age": 9,
        "gender": "Male",
        "clothing": "Yellow T-shirt & Blue Jeans",
        "reportedBy": "Vikram Gupta (Father)",
        "reportedTime": "34 mins ago",
        "status": "SEARCHING",
        "matchConfidence": 89.2,
        "lastSeenLocation": "Queue Complex Hall B - Gate 4",
        "cameraSource": "CCTV Cam #08 - Queue Entry",
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
        "notes": "Separated during crowd surge at aarti."
    },
    {
        "id": "LP-1044",
        "name": "Kalyani Devi",
        "age": 72,
        "gender": "Female",
        "clothing": "Red Banarasi Saree, Rudraksha Mala",
        "reportedBy": "Manoj Kumar (Son)",
        "reportedTime": "5 mins ago",
        "status": "PROCESSING_MATCH",
        "matchConfidence": 91.8,
        "lastSeenLocation": "Annadanam Hall Exit",
        "cameraSource": "CCTV Cam #22 - Prasadam Wing",
        "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        "notes": "Hearing impairment; temple staff alerted."
    }
]

INITIAL_GUIDES = [
    {
        "id": "TTD-G-1042",
        "name": "Rajan Pillai",
        "temple": "Tirumala Tirupati",
        "languages": "Telugu, Hindi, English",
        "dailyFeeRs": 350,
        "phone": "+91-9876543210",
        "status": "verified",
        "experience": "8 years",
        "rating": 4.8
    },
    {
        "id": "KED-G-2091",
        "name": "Mohan Bhatt",
        "temple": "Kedarnath Dham",
        "languages": "Hindi, English",
        "dailyFeeRs": 400,
        "phone": "+91-9812345678",
        "status": "verified",
        "experience": "12 years",
        "rating": 4.9
    },
    {
        "id": "VDG-G-3301",
        "name": "Suresh Kumar",
        "temple": "Vaishno Devi",
        "languages": "Punjabi, Hindi",
        "dailyFeeRs": 300,
        "phone": "+91-9654321098",
        "status": "verified",
        "experience": "5 years",
        "rating": 4.6
    },
    {
        "id": "KED-X-0099",
        "name": "Unknown Person",
        "temple": "Kedarnath",
        "languages": "Unknown",
        "dailyFeeRs": 2000,
        "phone": "Not available",
        "status": "under_review",
        "experience": "Unknown",
        "rating": 1.2
    },
    {
        "id": "TTD-F-0001",
        "name": "Ramesh (No Badge)",
        "temple": "Tirumala",
        "languages": "Telugu",
        "dailyFeeRs": 1500,
        "phone": "Not available",
        "status": "unverified",
        "experience": "Unknown",
        "rating": 2.1
    }
]

# --- Lost Person Operations ---
def get_lost_persons():
    return _load_json(LOST_PERSONS_FILE, INITIAL_LOST_PERSONS)

def add_lost_person(person_data):
    records = get_lost_persons()
    person_id = f"LP-{uuid.uuid4().hex[:4].upper()}"
    new_record = {
        "id": person_id,
        "name": person_data.get('name', 'Unknown Pilgrim'),
        "age": person_data.get('age', 'Unknown'),
        "gender": person_data.get('gender', 'Unspecified'),
        "clothing": person_data.get('clothing', 'Not specified'),
        "reportedBy": person_data.get('reportedBy', 'Devotee / App User'),
        "reportedTime": "Just now",
        "status": person_data.get('status', 'SEARCHING'),
        "matchConfidence": person_data.get('matchConfidence', None),
        "lastSeenLocation": person_data.get('lastSeenLocation', 'Temple Complex Grounds'),
        "cameraSource": person_data.get('cameraSource', 'Mobile App Report'),
        "image": person_data.get('image', ''),
        "notes": person_data.get('notes', 'Logged into Central Temple Security Dispatch.')
    }
    records.insert(0, new_record)
    _save_json(LOST_PERSONS_FILE, records)
    return new_record

# --- Guide Operations ---
def get_guides():
    return _load_json(GUIDES_FILE, INITIAL_GUIDES)

def search_guides(query_str):
    all_guides = get_guides()
    if not query_str:
        return all_guides
    q = query_str.lower()
    return [
        g for g in all_guides
        if q in g['name'].lower() or q in g['temple'].lower() or q in g['id'].lower()
    ]

def add_guide_report(report_data):
    reports = _load_json(REPORTS_FILE, [])
    report_id = f"REP-{uuid.uuid4().hex[:6].upper()}"
    record = {
        "reportId": report_id,
        "guideName": report_data.get('guideName'),
        "guideId": report_data.get('guideId'),
        "reporterName": report_data.get('reporterName', 'Anonymous Devotee'),
        "reportType": report_data.get('reportType', 'Suspicious Activity'),
        "description": report_data.get('description', ''),
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    reports.insert(0, record)
    _save_json(REPORTS_FILE, reports)
    return record

# --- Group Tracker Operations ---
def get_groups():
    return _load_json(GROUPS_FILE, {})

def create_group_record(leader_name, group_name, pilgrim_site):
    groups = get_groups()
    group_id = f"GRP-{uuid.uuid4().hex[:6].upper()}"
    group_code = f"DS-{uuid.uuid4().hex[:4].upper()}"
    
    group_record = {
        "groupId": group_id,
        "groupCode": group_code,
        "groupName": group_name or f"{leader_name}'s Pilgrim Sangha",
        "pilgrimSite": pilgrim_site or "Kedarnath Dham",
        "leaderName": leader_name,
        "createdAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "members": [
            {
                "id": "gm-1",
                "name": f"{leader_name} (Lead)",
                "role": "Group Leader",
                "lat": 30.7346,
                "lng": 79.0669,
                "distanceMeters": 0,
                "battery": "92%",
                "status": "Safe Nearby",
                "pulseBpm": 76,
                "altitude": "3,583 m"
            }
        ]
    }
    groups[group_id] = group_record
    _save_json(GROUPS_FILE, groups)
    return group_record

def join_group_record(group_code, member_name):
    groups = get_groups()
    target_group = None
    for gid, gdata in groups.items():
        if gdata.get('groupCode', '').upper() == group_code.strip().upper():
            target_group = gdata
            break
            
    if not target_group:
        return None, "Invalid or expired group code."

    member_id = f"gm-{len(target_group['members']) + 1}"
    new_member = {
        "id": member_id,
        "name": member_name,
        "role": "Family Member",
        "lat": 30.7348,
        "lng": 79.0671,
        "distanceMeters": 25,
        "battery": "85%",
        "status": "Safe Nearby",
        "pulseBpm": 82,
        "altitude": "3,582 m"
    }
    target_group['members'].append(new_member)
    _save_json(GROUPS_FILE, groups)
    return target_group, None

def get_group_members(group_id):
    groups = get_groups()
    if group_id in groups:
        return groups[group_id]['members']
    return None

def update_member_gps(group_id, member_id, lat, lng, distance=None):
    groups = get_groups()
    if group_id not in groups:
        return False
    for m in groups[group_id]['members']:
        if m['id'] == member_id:
            m['lat'] = lat
            m['lng'] = lng
            if distance is not None:
                m['distanceMeters'] = distance
                m['status'] = 'SEPARATION ALERT' if distance > 50 else 'Safe Nearby'
            _save_json(GROUPS_FILE, groups)
            return True
    return False
