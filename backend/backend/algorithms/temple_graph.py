# ============================================================
# temple_graph.py — Temple Checkpoints & Dynamic Graph Service
# ============================================================
# Stores the verified graph models for pilgrim sites and allows
# dynamic expansion (adding nodes & edges at runtime).
# ============================================================

import copy

# Base graph matching Tirumala / Kedarnath pilgrim complexes
DEFAULT_TEMPLE_NODES = [
    { 'id': 'ENTRY', 'name': 'South Gopuram (Main Entrance)', 'type': 'entry', 'x': 80, 'y': 320 },
    { 'id': 'REGISTRATION', 'name': 'Registration & Token Counter', 'type': 'checkpoint', 'x': 220, 'y': 300 },
    { 'id': 'SECURITY', 'name': 'Biometric Frisking & Cloakroom', 'type': 'checkpoint', 'x': 220, 'y': 320 },
    { 'id': 'TEMPLE_GATE', 'name': 'Temple Gate (Dwara)', 'type': 'checkpoint', 'x': 380, 'y': 200 },
    { 'id': 'QUEUE_GEN', 'name': 'Sarva Darshan Queue Hall A', 'type': 'queue', 'x': 380, 'y': 200 },
    { 'id': 'QUEUE_FAST', 'name': 'Special Darshan Line (Vedic Pass)', 'type': 'queue', 'x': 380, 'y': 440 },
    { 'id': 'DARSHAN_QUEUE', 'name': 'Darshan Queue Hall', 'type': 'queue', 'x': 520, 'y': 300 },
    { 'id': 'MED_CAMP', 'name': 'High-Altitude Oxygen & First Aid Post', 'type': 'medical', 'x': 500, 'y': 80 },
    { 'id': 'MEDICAL', 'name': 'Medical Help Desk', 'type': 'medical', 'x': 380, 'y': 420 },
    { 'id': 'WATER_POINT', 'name': 'Water Point & Rest', 'type': 'facility', 'x': 650, 'y': 200 },
    { 'id': 'INNER_MANDAP', 'name': 'Maha Mandapam (Inner Courtyard)', 'type': 'checkpoint', 'x': 600, 'y': 320 },
    { 'id': 'GARBHAGRIHA', 'name': 'Garbhagriha (Sanctum Sanctorum)', 'type': 'sanctum', 'x': 780, 'y': 320 },
    { 'id': 'PRASADAM', 'name': 'Laddu Prasadam & Annadanam Hub', 'type': 'facility', 'x': 680, 'y': 480 },
    { 'id': 'REST_AREA', 'name': 'Rest Area & Prasadam', 'type': 'facility', 'x': 650, 'y': 400 },
    { 'id': 'EMERGENCY_EXIT', 'name': 'Emergency Evacuation Corridor', 'type': 'exit', 'x': 620, 'y': 160 },
    { 'id': 'EXIT', 'name': 'Exit Gate & Parking', 'type': 'exit', 'x': 820, 'y': 300 },
    { 'id': 'EXIT_NORTH', 'name': 'North Exit Gate & Pilgrim Transit', 'type': 'exit', 'x': 920, 'y': 320 },
]

# Graph adjacency representation: { node_id: [(neighbor_id, distance_in_meters), ...] }
# Bidirectional paths for bidirectional pedestrian corridors
_ADJACENCY_LIST = {}

def _add_edge(u, v, dist, bidirectional=True):
    if u not in _ADJACENCY_LIST:
        _ADJACENCY_LIST[u] = []
    _ADJACENCY_LIST[u].append((v, dist))
    if bidirectional:
        if v not in _ADJACENCY_LIST:
            _ADJACENCY_LIST[v] = []
        _ADJACENCY_LIST[v].append((u, dist))

def initialize_default_graph():
    global _ADJACENCY_LIST
    _ADJACENCY_LIST = {}
    
    # 1. Fallback / Main route network
    _add_edge('ENTRY', 'REGISTRATION', 80)
    _add_edge('ENTRY', 'SECURITY', 120)
    _add_edge('REGISTRATION', 'TEMPLE_GATE', 200)
    _add_edge('REGISTRATION', 'MEDICAL', 150)
    _add_edge('SECURITY', 'QUEUE_GEN', 250)
    _add_edge('SECURITY', 'QUEUE_FAST', 180)
    
    _add_edge('TEMPLE_GATE', 'DARSHAN_QUEUE', 180)
    _add_edge('TEMPLE_GATE', 'WATER_POINT', 300)
    _add_edge('QUEUE_GEN', 'MED_CAMP', 150)
    _add_edge('QUEUE_GEN', 'INNER_MANDAP', 280)
    _add_edge('QUEUE_FAST', 'INNER_MANDAP', 210)
    _add_edge('DARSHAN_QUEUE', 'REST_AREA', 150)
    _add_edge('DARSHAN_QUEUE', 'EXIT', 350)
    _add_edge('DARSHAN_QUEUE', 'GARBHAGRIHA', 220)
    
    _add_edge('MED_CAMP', 'INNER_MANDAP', 200)
    _add_edge('MEDICAL', 'REST_AREA', 120)
    _add_edge('INNER_MANDAP', 'GARBHAGRIHA', 90)
    _add_edge('GARBHAGRIHA', 'PRASADAM', 160)
    _add_edge('GARBHAGRIHA', 'EXIT_NORTH', 190)
    
    _add_edge('WATER_POINT', 'EXIT', 220)
    _add_edge('REST_AREA', 'EXIT', 200)
    _add_edge('PRASADAM', 'EXIT_NORTH', 220)
    _add_edge('INNER_MANDAP', 'EMERGENCY_EXIT', 110)
    _add_edge('EMERGENCY_EXIT', 'EXIT_NORTH', 260)
    _add_edge('EXIT', 'EXIT_NORTH', 100)

initialize_default_graph()

def get_graph():
    return copy.deepcopy(_ADJACENCY_LIST)

def get_nodes():
    return copy.deepcopy(DEFAULT_TEMPLE_NODES)

def add_custom_location(node_id, name, node_type='checkpoint', x=400, y=300):
    for n in DEFAULT_TEMPLE_NODES:
        if n['id'] == node_id:
            n['name'] = name
            return n
    new_node = {'id': node_id, 'name': name, 'type': node_type, 'x': x, 'y': y}
    DEFAULT_TEMPLE_NODES.append(new_node)
    if node_id not in _ADJACENCY_LIST:
        _ADJACENCY_LIST[node_id] = []
    return new_node

def add_custom_path(from_node, to_node, distance, bidirectional=True):
    _add_edge(from_node, to_node, int(distance), bidirectional=bidirectional)
    return True
