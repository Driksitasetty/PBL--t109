# ============================================================
# app.py — DarshanSetu Flask Application Server
# ============================================================
# Main entry point for the Python Flask backend service:
# - Loads blueprints for all 5 modules
# - Configures CORS for React Vite frontend (port 5173 / localhost)
# - Provides health check and diagnostic status endpoints
# ============================================================

import os
from flask import Flask, jsonify
from flask_cors import CORS
from routes.api_routes import api_bp
from services.firebase_admin_service import init_firebase, is_firebase_active

def create_app():
    app = Flask(__name__)
    
    # Configure CORS: Allow requests from React frontend
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register API blueprint under /api prefix
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Attempt to initialize Firebase Admin if credentials exist
    fb_status = init_firebase()
    app.config['FIREBASE_STATUS'] = fb_status
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'DarshanSetu Flask Backend Engine',
            'version': '2.0.0',
            'modules': [
                '1. Lost Person Finder (Image Matching & Perceptual Hashing)',
                '2. Shortest Route Finder (Dijkstra Algorithm with Priority Queue)',
                '3. Pre-Medical Health Risk Adviser (Decision Tree ML Model)',
                '4. Group Member Separation Radar & Alerts',
                '5. Devotee Guide Verification & Anti-Fraud Shield'
            ],
            'firebase_cloud_status': fb_status
        }), 200

    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'DarshanSetu API Gateway Active.',
            'documentation': '/health',
            'frontend_endpoint': 'http://localhost:5173'
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print(f"🛕 DarshanSetu Flask Backend running on http://127.0.0.1:{port}")
    print("Ready to serve React Frontend at http://localhost:5173")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=True)
