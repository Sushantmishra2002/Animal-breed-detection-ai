"""
API Testing Script - Verify the backend is working correctly
Run this after starting the backend: python backend/main.py
"""

import requests
import json
import sys
from pathlib import Path

API_URL = "http://localhost:8000"
TIMEOUT = 10

def print_header(text):
    """Print formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def test_root():
    """Test root endpoint"""
    print_header("TEST 1: Root Endpoint")
    try:
        response = requests.get(f"{API_URL}/", timeout=TIMEOUT)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_health():
    """Test health endpoint"""
    print_header("TEST 2: Health Check")
    try:
        response = requests.get(f"{API_URL}/health", timeout=TIMEOUT)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")

        if not data.get('model_loaded'):
            print("\n⚠️  Warning: Model not loaded!")
            print("   Please train the model first: python training/train.py")
            return False
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_breeds():
    """Test get all breeds endpoint"""
    print_header("TEST 3: Get All Breeds")
    try:
        response = requests.get(f"{API_URL}/breeds", timeout=TIMEOUT)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Total Breeds: {data['total_breeds']}")
        print(f"\nSample Breeds (first 3):")

        breeds = data['breeds']
        count = 0
        for breed_name, breed_info in breeds.items():
            if count >= 3:
                break
            print(f"\n  {breed_name}:")
            print(f"    Type: {breed_info['type']}")
            print(f"    Origin: {breed_info['origin']}")
            count += 1

        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_specific_breed():
    """Test get specific breed endpoint"""
    print_header("TEST 4: Get Specific Breed (Gir)")
    try:
        response = requests.get(f"{API_URL}/breeds/Gir", timeout=TIMEOUT)
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_predict(image_path):
    """Test predict endpoint"""
    print_header("TEST 5: Predict Breed from Image")

    if not Path(image_path).exists():
        print(f"❌ Error: Image not found at {image_path}")
        print(f"\nTo test prediction, provide an image file:")
        print(f"  python test_api.py path/to/image.jpg")
        return False

    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{API_URL}/predict", files=files, timeout=TIMEOUT)

        print(f"Status Code: {response.status_code}")
        data = response.json()

        if response.status_code == 200:
            print(f"✓ Prediction successful!")
            print(f"\nTop Match: {data['top_match']}")
            print(f"Confidence: {data['confidence']}%")
            print(f"\nTop 3 Predictions:")
            for i, pred in enumerate(data['predictions'], 1):
                print(f"\n  {i}. {pred['breed']}")
                print(f"     Confidence: {pred['confidence']}%")
                print(f"     Type: {pred['type']}")
                print(f"     Origin: {pred['origin']}")
        else:
            print(f"Response: {json.dumps(data, indent=2)}")

        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  CATTLE & BUFFALO BREED IDENTIFICATION API - TEST SUITE")
    print("="*60)

    print("\nMake sure the backend is running:")
    print("  python backend/main.py")

    results = []

    # Run basic tests
    results.append(("Root Endpoint", test_root()))
    results.append(("Health Check", test_health()))
    results.append(("Get All Breeds", test_breeds()))
    results.append(("Get Specific Breed", test_specific_breed()))

    # Test prediction if image provided
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        results.append(("Predict from Image", test_predict(image_path)))
    else:
        print("\n" + "="*60)
        print("  TEST 5: Predict Breed from Image")
        print("="*60)
        print("\nTo test image prediction, run:")
        print("  python test_api.py path/to/image.jpg")

    # Print summary
    print_header("TEST SUMMARY")
    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "✓ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")

    print(f"\nTotal: {passed}/{total} tests passed")

    if passed == total:
        print("\n✓ All tests passed! API is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above.")

    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Test interrupted by user")
        sys.exit(1)
