import requests
import json

def test_analyze_wallet():
    url = "http://localhost:8000/api/analyze_wallet"
    payload = {"wallet": "FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH"}
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_analyze_wallet()
