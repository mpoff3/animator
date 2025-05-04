import os
import uuid
import subprocess
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import re
from openai import OpenAI

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'media/videos'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Make sure your OPENAI_API_KEY is set in the environment
client = OpenAI()

# Default prompt template
DEFAULT_PROMPT_TEMPLATE = """
You're an expert math educator and Manim CE programmer.

Create a **complete and runnable Manim CE script** that visually explains the following question step by step:

**Question:** "{question}"

🎯 Goals:
- Define a class called {scene_name} that inherits from `Scene`
- Use **clear visuals**, like Matrix() objects, arrows, highlights, and MathTex for symbolic steps
- Visually walk through each **step of the concept**, from setup to final answer
- Show intermediate symbolic steps (like dot products) using MathTex:
    e.g. MathTex(r"2*5 + 3*(-2) = 4")
- Use `Text()` or `MathTex()` captions to explain what's happening
- Arrange visuals on screen so they don't overlap
- Use `Create`, `Write`, `FadeOut`, and color animations to guide the viewer's attention
- Add short pauses (`wait(1)` or `wait(2)`) after each explanation step

🧠 Constraints:
- Use **symbolic math**, not numerical computation (no `.dot()` or `numpy`)
- Only use `Matrix()` for visual representation
- Keep the animation polished and focused — don't crowd the screen

📦 Final output:
Respond **only with valid Python code**, using standard Manim CE. No comments or markdown.
"""

def auto_fix_code(code: str) -> str:
    """
    Fixes common GPT-generated errors in Manim matrix/vector syntax:
    - Converts 1D Matrix([1, 2]) into column Matrix([[1], [2]])
    - Removes unsupported .T (transpose)
    """
    # Remove .T used on Matrix
    code = re.sub(r'\.T\b', '', code)

    # Fix Matrix([number, number, ...]) -> Matrix([[number], [number], ...])
    def convert_1d_matrix_to_column(match):
        numbers = match.group(1)
        elements = [e.strip() for e in numbers.split(',')]
        column = ', '.join(f'[{e}]' for e in elements)
        return f'Matrix([{column}])'

    code = re.sub(r'Matrix\(\[([^\[\]]+?)\]\)', convert_1d_matrix_to_column, code)

    return code

def generate_manim_code(question, scene_name, prompt_template=None):
    """Generate Manim code using OpenAI API"""
    prompt = prompt_template or DEFAULT_PROMPT_TEMPLATE
    prompt = prompt.format(question=question, scene_name=scene_name)
    
    print(f"🧠 Generating Manim script for question: {question}")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    content = response.choices[0].message.content
    # Extract code from markdown-style triple backticks
    match = re.search(r"```python(.*?)```", content, re.DOTALL)
    return match.group(1).strip() if match else content.strip()

def save_code(code: str, output_file):
    """Save the generated code to a file"""
    with open(output_file, "w") as f:
        f.write(code)
    print(f"✅ Saved generated code to {output_file}")

def render_scene(output_file, scene_name):
    """Run Manim to render the scene"""
    print(f"🎬 Running Manim to render the scene: {scene_name}")
    result = subprocess.run(
        ["manim", "-pql", output_file, scene_name],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error rendering scene: {result.stderr}")
        return False, result.stderr
    
    return True, result.stdout

@app.route('/generate', methods=['POST'])
def generate_animation():
    """
    Generate a Manim animation based on a question.
    
    POST parameters:
    - question: The math question to explain
    - prompt_template (optional): Custom prompt template to use
    
    Returns:
    - JSON with file path and status
    """
    if 'question' not in request.form:
        return jsonify({'error': 'No question provided'}), 400
    
    question = request.form['question']
    prompt_template = request.form.get('prompt_template')
    
    # Generate a unique ID for this request
    request_id = str(uuid.uuid4())
    scene_name = f"Scene_{request_id[:8]}"
    
    # Create unique filenames
    py_filename = f"scene_{request_id}.py"
    py_filepath = os.path.join(app.config['UPLOAD_FOLDER'], py_filename)
    
    # Generate and save the code
    manim_code = auto_fix_code(generate_manim_code(question, scene_name, prompt_template))
    save_code(manim_code, py_filepath)
    
    # Render the scene
    success, output = render_scene(py_filepath, scene_name)
    
    if not success:
        return jsonify({
            'status': 'error',
            'message': 'Failed to render animation',
            'details': output
        }), 500
    
    # Find the generated MP4 file
    # Manim typically saves to ./media/videos/scene_<uuid>/1080p60/Scene_<uuid>.mp4
    video_dir = f"media/videos/{py_filename[:-3]}/1080p60"
    video_filename = f"{scene_name}.mp4"
    video_path = os.path.join(video_dir, video_filename)
    
    if not os.path.exists(video_path):
        return jsonify({
            'status': 'error',
            'message': 'Video file not found after rendering',
            'expected_path': video_path
        }), 500
    
    return jsonify({
        'status': 'success',
        'question': question,
        'video_path': video_path,
        'python_file': py_filepath
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
