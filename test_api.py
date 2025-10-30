import requests
import json

try:
    response = requests.post(
        'http://localhost:8000/api/analyze_wallet',
        json={"wallet": "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE"},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {str(e)}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Response status: {e.response.status_code}")
        print(f"Response body: {e.response.text}")
