import requests
import json

def test_generate():
    """
    Test the /generate endpoint by sending a sample prompt and question.
    """
    url = "http://localhost:5000/generate"
    
    # Sample data
    data = {
        "question": "How does the Pythagorean theorem work?",
        "prompt": """
Create a Manim animation that explains {QUESTION}. 
Use the scene name {SCENE_NAME}.
Include clear step-by-step visual explanations with appropriate text labels.
"""
    }
    
    # Send POST request
    print("Sending request to generate endpoint...")
    response = requests.post(url, data=data)
    
    # Print response
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2))
        print(f"\nVideo URL: {result.get('static_video_url')}")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    test_generate()
