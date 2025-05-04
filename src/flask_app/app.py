import os
import re
import uuid
import subprocess
from flask import Flask, request, jsonify, send_from_directory, render_template
from openai import OpenAI

# Initialize Flask and OpenAI
app = Flask(__name__)
client = OpenAI()

# Directory setup
OUTPUT_DIR = "generated_scripts"
VIDEO_DIR = "media/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    question = request.form.get("question")
    custom_prompt = request.form.get("prompt")

    if not question or not custom_prompt:
        return jsonify({"error": "Missing question or prompt"}), 400

    scene_name = "GeneratedScene"
    script_id = uuid.uuid4().hex[:8]
    script_file = os.path.join(OUTPUT_DIR, f"{script_id}.py")

    # Format full prompt
    full_prompt = custom_prompt.replace("{QUESTION}", question).replace("{SCENE_NAME}", scene_name)

    try:
        # Call OpenAI GPT-4
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": full_prompt}],
            temperature=0.3,
        )
        content = response.choices[0].message.content
        code = extract_code(content)
        code = auto_fix_code(code)

        # Save the script
        with open(script_file, "w") as f:
            f.write(code)

        # Render using Manim
        subprocess.run(["manim", "-pql", script_file, scene_name], check=True)

        # Get final video path
        video_path = os.path.join(VIDEO_DIR, os.path.splitext(os.path.basename(script_file))[0], f"{scene_name}.mp4")
        if not os.path.exists(video_path):
            return jsonify({"error": "Video rendering failed"}), 500

        return jsonify({"video_url": f"/video/{os.path.basename(os.path.dirname(video_path))}/{scene_name}.mp4"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/video/<folder>/<filename>")
def serve_video(folder, filename):
    return send_from_directory(os.path.join(VIDEO_DIR, folder), filename)

def extract_code(content: str) -> str:
    match = re.search(r"```python(.*?)```", content, re.DOTALL)
    if match:
        return match.group(1).strip()
    else:
        # If no code block is found, check if this is a conversational response
        if not content.strip().startswith("from manim import") and not content.strip().startswith("import"):
            # This is likely not code at all
            return "# No valid code was generated\n\nfrom manim import *\n\nclass GeneratedScene(Scene):\n    def construct(self):\n        self.add(Text(\"Please provide a more specific math concept to visualize.\"))"
        return content.strip()

def auto_fix_code(code: str) -> str:
    # Remove `.T`
    code = re.sub(r'\.T\b', '', code)

    # Replace 1D Matrix([1, 2]) → Matrix([[1], [2]])
    def to_column(match):
        nums = [f"[{n.strip()}]" for n in match.group(1).split(",")]
        return f"Matrix([{', '.join(nums)}])"

    code = re.sub(r'Matrix\(\[([^\[\]]+?)\]\)', to_column, code)

    # Remove .dot() if mistakenly used
    code = re.sub(r'Matrix\(.*?\)\.dot\(.*?\)', '# Removed invalid .dot() usage', code)

    return code

if __name__ == "__main__":
    app.run(debug=True)

