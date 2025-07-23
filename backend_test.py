#!/usr/bin/env python3
"""
Backend API Testing for FrontendPiensa React App
Tests the expected backend endpoints that the React app tries to connect to.
"""

import requests
import sys
from datetime import datetime

class BackendAPITester:
    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status=None, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=5)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=5)

            print(f"   Status: {response.status_code}")
            
            # If no expected status provided, just check if we get a response
            if expected_status is None:
                success = response.status_code < 500
            else:
                success = response.status_code == expected_status
                
            if success:
                self.tests_passed += 1
                print(f"✅ {name} - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {response_data}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.results.append({
                'name': name,
                'url': url,
                'method': method,
                'status': response.status_code,
                'success': success,
                'response': response.text[:200]
            })
            
            return success, response

        except requests.exceptions.ConnectionError:
            print(f"❌ {name} - Connection refused (no server running)")
            self.results.append({
                'name': name,
                'url': url,
                'method': method,
                'status': 'CONNECTION_ERROR',
                'success': False,
                'response': 'Connection refused'
            })
            return False, None
        except requests.exceptions.Timeout:
            print(f"❌ {name} - Request timeout")
            self.results.append({
                'name': name,
                'url': url,
                'method': method,
                'status': 'TIMEOUT',
                'success': False,
                'response': 'Request timeout'
            })
            return False, None
        except Exception as e:
            print(f"❌ {name} - Error: {str(e)}")
            self.results.append({
                'name': name,
                'url': url,
                'method': method,
                'status': 'ERROR',
                'success': False,
                'response': str(e)
            })
            return False, None

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication Endpoints...")
        
        # Test login endpoint
        login_data = {
            "usernameOrEmail": "test@example.com",
            "password": "testpassword"
        }
        self.run_test("Login", "POST", "auth/login", data=login_data)
        
        # Test register endpoint (if exists)
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword"
        }
        self.run_test("Register", "POST", "auth/register", data=register_data)

    def test_esp32_endpoints(self):
        """Test ESP32 data endpoints"""
        print("\n📡 Testing ESP32 Data Endpoints...")
        
        # Test speaker status
        self.run_test("Speaker Status", "GET", "esp32-data/speaker-status/1")
        
        # Test active session
        self.run_test("Active Session", "GET", "esp32-data/active-session/speaker/1")
        
        # Test start session
        session_data = {
            "speakerId": 1,
            "userId": 1,
            "initialBatteryPercentage": 100
        }
        self.run_test("Start Session", "POST", "esp32-data/start-session", data=session_data)
        
        # Test current session
        self.run_test("Current Session", "GET", "esp32-data/current-session/1")

    def test_basic_connectivity(self):
        """Test basic server connectivity"""
        print("\n🌐 Testing Basic Connectivity...")
        
        # Test root endpoint
        self.run_test("Root Endpoint", "GET", "")
        
        # Test health check (common endpoint)
        self.run_test("Health Check", "GET", "health")
        
        # Test API root
        self.run_test("API Root", "GET", "api")

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 BACKEND API TEST SUMMARY")
        print(f"="*60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        print(f"\n📋 DETAILED RESULTS:")
        for result in self.results:
            status_icon = "✅" if result['success'] else "❌"
            print(f"{status_icon} {result['name']}: {result['status']}")
        
        print(f"\n💡 RECOMMENDATIONS:")
        if self.tests_passed == 0:
            print("- No backend server appears to be running on localhost:3000")
            print("- The React app expects API endpoints but they are not available")
            print("- Consider setting up a backend server or mock API")
        elif self.tests_passed < self.tests_run:
            print("- Some endpoints are working but others are missing")
            print("- Check backend implementation for missing routes")
        else:
            print("- All tested endpoints are responding")

def main():
    print("🚀 Starting Backend API Tests for FrontendPiensa React App")
    print(f"⏰ Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = BackendAPITester()
    
    # Run all tests
    tester.test_basic_connectivity()
    tester.test_auth_endpoints()
    tester.test_esp32_endpoints()
    
    # Print summary
    tester.print_summary()
    
    # Return exit code
    return 0 if tester.tests_passed > 0 else 1

if __name__ == "__main__":
    sys.exit(main())