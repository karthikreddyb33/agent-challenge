import requests
import json

# Test GET request
print("Testing GET request...")
response = requests.get(
    "http://localhost:8000/api/analyze_wallet",
    params={"wallet": "FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH"}
)
print(f"GET Status Code: {response.status_code}")
print("GET Response:")
print(json.dumps(response.json(), indent=2))

# Test POST request
print("\nTesting POST request...")
response = requests.post(
    "http://localhost:8000/api/analyze_wallet",
    json={"wallet": "FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH"}
)
print(f"POST Status Code: {response.status_code}")
print("POST Response:")
print(json.dumps(response.json(), indent=2))
