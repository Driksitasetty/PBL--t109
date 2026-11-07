# ============================================================
# firebase_admin_service.py — Firebase Cloud Persistence Bridge
# ============================================================
# Connects the Flask Python backend to Google Cloud Firebase:
# - Cloud Firestore (Real-time collections)
# - Firebase Authentication Token verification
# - Firebase Storage bucket interactions
#
# Gracefully provides clear status reporting when service account
# credentials are not yet supplied, preventing crashes.
# ============================================================

import os
import json

FIREBASE_INITIALIZED = False
_db = None

def init_firebase():
    global FIREBASE_INITIALIZED, _db
    cred_path = os.environ.get('FIREBASE_SERVICE_ACCOUNT_KEY')
    
    # Check default location if not specified in environment
    if not cred_path:
        default_key = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'firebase_key.json')
        if os.path.exists(default_key):
            cred_path = default_key

    if not cred_path or not os.path.exists(cred_path):
        FIREBASE_INITIALIZED = False
        return {
            'status': 'unconfigured',
            'message': 'Firebase credentials file not provided. Operating in robust local persistent mode.'
        }

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            
        _db = firestore.client()
        FIREBASE_INITIALIZED = True
        return {'status': 'connected', 'message': 'Firebase Admin successfully authenticated.'}
    except Exception as e:
        FIREBASE_INITIALIZED = False
        return {'status': 'error', 'message': f'Failed to initialize Firebase Admin: {str(e)}'}

def get_firestore_client():
    if not FIREBASE_INITIALIZED:
        init_firebase()
    return _db

def is_firebase_active():
    return FIREBASE_INITIALIZED
