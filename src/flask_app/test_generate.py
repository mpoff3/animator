import requests
import json
import os
import time


def test_generate():
    """
    Test the /generate endpoint by sending a sample prompt and question.
    """
    url = "http://127.0.0.1:5000/generate"

    # Sample data
    data = {
        "question": "How does the Pythagorean theorem work?",
        "prompt": """
You're an expert educator and Manim CE developer.

Create a complete and runnable Manim CE script that visually explains the following math question in a clear, step-by-step animation:

Question: "{QUESTION}"

Goals:
Define a class called GeneratedScene that inherits from Scene
Break the explanation into 3–6 short steps
Use Text() to explain each step simply (one sentence max)
Use MathTex() for all math (e.g., equations, fractions, dot products)
If applicable, use Matrix() objects to show visual matrix/vector layout
Use Write, Create, and FadeOut to animate content
Add pauses using wait(1) or wait(2) after each step
Visually show the final answer at the end of the scene

Constraints:
Don't use .dot(), .T, or real math operations
Don't use numpy, sympy, or external math libraries
Keep all math symbolic and visually instructive
+ Keep visuals uncluttered:
  
If multiple elements are on screen together, use .next_to() or .shift() to space them
If an element replaces the previous one, center it (e.g., at ORIGIN, DOWN, or UP) so content stays vertically balanced
Manim script shouldn't include unneccesary comments


Output:
Respond ONLY with valid Python code
The script must run with manim -pql script.py {SCENE_NAME} without errors
""",
    }

    # Check if OPENAI_API_KEY is set
    if not os.environ.get("OPENAI_API_KEY"):
        print("WARNING: OPENAI_API_KEY environment variable is not set.")
        print("Set it with: export OPENAI_API_KEY=your_api_key_here")

    # Send POST request with timeout and error handling
    print("Sending request to generate endpoint...")
    try:
        response = requests.post(url, data=data, timeout=60)
        
        # Print response
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(json.dumps(result, indent=2))
            print(f"\nVideo URL: {result.get('static_video_url')}")
        else:
            print(f"Error: {response.text}")
            
    except requests.exceptions.Timeout:
        print("Request timed out. The server might be taking too long to respond.")
    except requests.exceptions.ConnectionError:
        print("Connection error. Make sure the Flask server is running at http://127.0.0.1:5000")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    test_generate()
