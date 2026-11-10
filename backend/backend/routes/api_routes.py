# ============================================================
# api_routes.py — Flask REST API Endpoints for Darshan Setu
# ============================================================
from flask import Blueprint, request, jsonify
from algorithms.dijkstra import run_dijkstra
from algorithms.temple_graph import get_graph, get_nodes, add_custom_location, add_custom_path
from ml.predict import predict_health, get_model_and_metadata
from ml.image_matcher import compare_images
from services.state_manager import (
    get_lost_persons, add_lost_person,
    get_guides, search_guides, add_guide_report,
    create_group_record, join_group_record, get_group_members, update_member_gps, get_groups
)
from services.firebase_admin_service import is_firebase_active

api_bp = Blueprint('api', __name__)

# ============================================================
# MODULE 1: LOST PERSON FINDER & IMAGE MATCHING
# ============================================================

@api_bp.route('/lost-persons', methods=['GET'])
def get_lost_person_reports():
    """Retrieve all lost person incident records."""
    try:
        reports = get_lost_persons()
        return jsonify({'success': True, 'reports': reports, 'count': len(reports)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': f'Failed to retrieve reports: {str(e)}'}), 500

@api_bp.route('/report-lost-person', methods=['POST'])
def report_lost_person_endpoint():
    """Submit a new lost person incident with validated details and photo."""
    try:
        data = request.get_json(silent=True) or {}
        if not data.get('name'):
            return jsonify({'success': False, 'error': 'Name of missing devotee is required.'}), 400

        record = add_lost_person(data)
        return jsonify({'success': True, 'message': 'Lost person report registered successfully.', 'report': record}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': f'Registration failed: {str(e)}'}), 500

@api_bp.route('/match-image', methods=['POST'])
def match_images_endpoint():
    """
    Compare uploaded devotee portrait against candidate photo using
    perceptual gradient difference hashing and chromatic histogram analysis.
    """
    try:
        data = request.get_json(silent=True) or {}
        img1 = data.get('image1')
        img2 = data.get('image2')

        if not img1 or not img2:
            return jsonify({'success': False, 'error': 'Two images (image1 and image2) are required for comparison.'}), 400

        result = compare_images(img1, img2)
        return jsonify(result), 200
    except ValueError as ve:
        return jsonify({'success': False, 'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': f'Image processing error: {str(e)}'}), 500

# ============================================================
# MODULE 2: SHORTEST ROUTE FINDER (DIJKSTRA'S ALGORITHM)
# ============================================================

@api_bp.route('/temples', methods=['GET'])
def get_temple_nodes():
    """Return all configured temple checkpoints and network connections."""
    try:
        nodes = get_nodes()
        return jsonify({'success': True, 'nodes': nodes, 'count': len(nodes)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/route', methods=['POST'])
def compute_route():
    """
    Find shortest path between source and destination using Dijkstra's Algorithm
    with Min-Priority Queue.
    """
    try:
        data = request.get_json(silent=True) or {}
        source = data.get('source')
        destination = data.get('destination')

        if not source or not destination:
            return jsonify({'success': False, 'error': 'Both source and destination checkpoint IDs are required.'}), 400

        graph = get_graph()
        result = run_dijkstra(graph, source, destination)

        if not result.get('success'):
            return jsonify(result), 400

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'success': False, 'error': f'Route calculation failed: {str(e)}'}), 500

@api_bp.route('/route/add-node', methods=['POST'])
def add_custom_node_endpoint():
    """Dynamically add or update a checkpoint in the graph."""
    try:
        data = request.get_json(silent=True) or {}
        node_id = data.get('id')
        name = data.get('name')
        if not node_id or not name:
            return jsonify({'success': False, 'error': 'Checkpoint ID and name are required.'}), 400
        node = add_custom_location(node_id, name, data.get('type', 'checkpoint'))
        return jsonify({'success': True, 'node': node}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/route/add-edge', methods=['POST'])
def add_custom_edge_endpoint():
    """Dynamically add a walkway connection between checkpoints."""
    try:
        data = request.get_json(silent=True) or {}
        u = data.get('from')
        v = data.get('to')
        dist = data.get('distance')
        if not u or not v or dist is None:
            return jsonify({'success': False, 'error': 'from, to, and distance are required.'}), 400
        add_custom_path(u, v, float(dist))
        return jsonify({'success': True, 'message': f'Path added between {u} and {v}'}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================
# MODULE 3: PRE-TRAVEL HEALTH RISK PREDICTOR (MACHINE LEARNING)
# ============================================================

@api_bp.route('/health-model-info', methods=['GET'])
def get_health_model_metadata():
    """Return trained Decision Tree model specifications and evaluation metrics."""
    try:
        _, metadata = get_model_and_metadata()
        if metadata:
            return jsonify({'success': True, 'metadata': metadata}), 200
        return jsonify({'success': False, 'error': 'Model metadata not initialized.'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/predict-health-risk', methods=['POST'])
def predict_health_risk_endpoint():
    """Run ML Decision Tree inference on pilgrim health indicators."""
    try:
        data = request.get_json(silent=True) or {}
        result = predict_health(data)
        return jsonify(result), 200
    except ValueError as ve:
        return jsonify({'success': False, 'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': f'Prediction engine error: {str(e)}'}), 500

# ============================================================
# MODULE 4: GROUP TRACKER & PROXIMITY RADAR ALERTS
# ============================================================

@api_bp.route('/groups/create', methods=['POST'])
def create_group():
    """Initialize a new pilgrim travel sangha / family group."""
    try:
        data = request.get_json(silent=True) or {}
        leader_name = data.get('leaderName')
        if not leader_name:
            return jsonify({'success': False, 'error': 'Leader name is required.'}), 400

        record = create_group_record(
            leader_name=leader_name,
            group_name=data.get('groupName'),
            pilgrim_site=data.get('pilgrimSite')
        )
        return jsonify({'success': True, 'group': record}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/groups/join', methods=['POST'])
def join_group():
    """Join an existing pilgrim group via join code."""
    try:
        data = request.get_json(silent=True) or {}
        code = data.get('groupCode')
        member_name = data.get('memberName')
        if not code or not member_name:
            return jsonify({'success': False, 'error': 'Group code and member name are required.'}), 400

        group, err = join_group_record(code, member_name)
        if err:
            return jsonify({'success': False, 'error': err}), 404

        return jsonify({'success': True, 'group': group}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/groups/<group_id>/members', methods=['GET'])
def get_members(group_id):
    """Retrieve current members and proximity status for a group."""
    try:
        members = get_group_members(group_id)
        if members is None:
            return jsonify({'success': False, 'error': f"Group '{group_id}' not found."}), 404
        return jsonify({'success': True, 'members': members}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/groups/<group_id>/update-location', methods=['POST'])
def update_location(group_id):
    """Update GPS coordinates and check separation status."""
    try:
        data = request.get_json(silent=True) or {}
        member_id = data.get('memberId')
        lat = data.get('lat')
        lng = data.get('lng')
        distance = data.get('distance')

        if not member_id or lat is None or lng is None:
            return jsonify({'success': False, 'error': 'memberId, lat, and lng are required.'}), 400

        updated = update_member_gps(group_id, member_id, lat, lng, distance)
        if not updated:
            return jsonify({'success': False, 'error': 'Member or group not found.'}), 404

        return jsonify({'success': True, 'message': 'Location updated.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/groups/<group_id>/alerts', methods=['GET'])
def get_group_alerts(group_id):
    """Check if any member currently violates safe separation radius."""
    try:
        members = get_group_members(group_id)
        if members is None:
            return jsonify({'success': False, 'error': 'Group not found.'}), 404

        threshold = request.args.get('threshold', 50, type=int)
        separated = [m for m in members if m.get('distanceMeters', 0) > threshold]

        return jsonify({
            'success': True,
            'has_alerts': len(separated) > 0,
            'threshold_meters': threshold,
            'separated_members': separated
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================
# MODULE 5: GUIDE VERIFICATION & DEVOTEE ANTI-FRAUD SHIELD
# ============================================================

@api_bp.route('/guides', methods=['GET'])
def list_guides():
    """List all registered and audited temple guides."""
    try:
        guides = get_guides()
        return jsonify({'success': True, 'guides': guides, 'count': len(guides)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/guides/search', methods=['GET'])
def search_guides_endpoint():
    """Filter guides by name, temple, or badge ID."""
    try:
        query = request.args.get('q', '')
        results = search_guides(query)
        return jsonify({'success': True, 'guides': results, 'query': query}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/report-guide', methods=['POST'])
def report_guide_endpoint():
    """Log an anti-fraud report against an unauthorized or exploitative guide."""
    try:
        data = request.get_json(silent=True) or {}
        if not data.get('description'):
            return jsonify({'success': False, 'error': 'Incident description is required.'}), 400

        record = add_guide_report(data)
        return jsonify({'success': True, 'message': 'Anti-fraud report logged for official administrative review.', 'report': record}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
