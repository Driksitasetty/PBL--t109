# ============================================================
# test_backend_end_to_end.py — Automated Test Suite
# ============================================================
import io
import json
import base64
import unittest
from PIL import Image
from app import create_app
from algorithms.dijkstra import run_dijkstra
from algorithms.temple_graph import get_graph

def create_test_image_base64(color=(255, 0, 0), size=(64, 64)):
    img = Image.new('RGB', size, color=color)
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return base64.b64encode(buf.getvalue()).decode('utf-8')

class DarshanSetuBackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_health_endpoint(self):
        """Test server health and module registration"""
        res = self.client.get('/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(len(data['modules']), 5)

    # ----------------------------------------------------
    # MODULE 1: LOST PERSON FINDER TESTS
    # ----------------------------------------------------
    def test_image_matching_identical(self):
        """Identical images must yield ~100% similarity"""
        img_b64 = create_test_image_base64((200, 100, 50))
        res = self.client.post('/api/match-image', json={
            'image1': img_b64,
            'image2': img_b64
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertGreaterEqual(data['confidence'], 90.0)

    def test_image_matching_different(self):
        """Disparate images must return lower similarity score"""
        img1 = create_test_image_base64((255, 0, 0))
        img2 = create_test_image_base64((0, 255, 0))
        res = self.client.post('/api/match-image', json={
            'image1': img1,
            'image2': img2
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertLess(data['confidence'], 75.0)

    def test_image_matching_invalid_input(self):
        """Invalid base64 payload must return clean 400 error"""
        res = self.client.post('/api/match-image', json={
            'image1': 'not_an_image',
            'image2': 'invalid'
        })
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])

    def test_report_lost_person(self):
        """Adding a new lost person record must persist"""
        res = self.client.post('/api/report-lost-person', json={
            'name': 'Test Pilgrim Devotee',
            'age': 55,
            'gender': 'Male',
            'clothing': 'White Kurta',
            'lastSeenLocation': 'Gate 3'
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['report']['name'], 'Test Pilgrim Devotee')

    # ----------------------------------------------------
    # MODULE 2: SHORTEST ROUTE (DIJKSTRA) TESTS
    # ----------------------------------------------------
    def test_dijkstra_shortest_route(self):
        """Calculate valid route from ENTRY to EXIT"""
        res = self.client.post('/api/route', json={
            'source': 'ENTRY',
            'destination': 'EXIT'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertIn('ENTRY', data['path'])
        self.assertIn('EXIT', data['path'])
        self.assertGreater(data['totalDistance'], 0)

    def test_dijkstra_disconnected_or_invalid_node(self):
        """Querying invalid node must fail gracefully"""
        res = self.client.post('/api/route', json={
            'source': 'NON_EXISTENT_SOURCE',
            'destination': 'EXIT'
        })
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertFalse(data['success'])

    # ----------------------------------------------------
    # MODULE 3: PRE-MEDICAL ADVISER (ML) TESTS
    # ----------------------------------------------------
    def test_health_prediction_healthy_adult(self):
        """Adult with no conditions at low altitude should have low risk"""
        res = self.client.post('/api/predict-health-risk', json={
            'age_group': 1,
            'altitude_category': 0,
            'exertion_level': 0,
            'has_heart_condition': 0,
            'has_breathing_issues': 0,
            'is_diabetic': 0
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['risk_level'], 'Low')

    def test_health_prediction_critical_senior(self):
        """Senior with heart condition at high altitude must trigger High Risk"""
        res = self.client.post('/api/predict-health-risk', json={
            'age_group': 2,
            'altitude_category': 2,
            'exertion_level': 2,
            'has_heart_condition': 1,
            'has_breathing_issues': 1,
            'is_diabetic': 1
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data['success'])
        self.assertEqual(data['risk_level'], 'High')
        self.assertIn('disclaimer', data)

    # ----------------------------------------------------
    # MODULE 4 & 5: GROUP ALERTS & GUIDE VERIFICATION TESTS
    # ----------------------------------------------------
    def test_group_lifecycle(self):
        """Create group, retrieve members, and check alerts"""
        create_res = self.client.post('/api/groups/create', json={
            'leaderName': 'Arun Sharma',
            'groupName': 'Kedarnath Yatra Sangh'
        })
        self.assertEqual(create_res.status_code, 201)
        group_id = create_res.get_json()['group']['groupId']

        # Check members
        mem_res = self.client.get(f'/api/groups/{group_id}/members')
        self.assertEqual(mem_res.status_code, 200)
        self.assertEqual(len(mem_res.get_json()['members']), 1)

    def test_guides_search_and_report(self):
        """Search guides and submit a verified report"""
        search_res = self.client.get('/api/guides/search?q=Tirumala')
        self.assertEqual(search_res.status_code, 200)
        guides = search_res.get_json()['guides']
        self.assertTrue(any('Tirumala' in g['temple'] for g in guides))

        rep_res = self.client.post('/api/report-guide', json={
            'guideName': 'Unregistered Scout',
            'reporterName': 'Test Devotee',
            'reportType': 'overcharging',
            'description': 'Charged 2000 INR exceeding temple cap.'
        })
        self.assertEqual(rep_res.status_code, 201)

if __name__ == '__main__':
    unittest.main()
