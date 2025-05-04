import os
import re
import uuid
import subprocess
import shutil
import logging
import traceback
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS
from openai import OpenAI

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize Flask and OpenAI
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check for API key
if not os.environ.get("OPENAI_API_KEY"):
    logger.warning("OPENAI_API_KEY environment variable is not set!")
    logger.warning("Set it with: export OPENAI_API_KEY=your_api_key_here")

# Initialize OpenAI client
try:
    client = OpenAI()
    logger.info("OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"Error initializing OpenAI client: {str(e)}")
    client = None

# Directory setup
OUTPUT_DIR = "generated_scripts"
VIDEO_DIR = "media/videos"
STATIC_DIR = "static"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    question = request.form.get("question")
    custom_prompt = request.form.get("prompt")

    if not question or not custom_prompt:
        return jsonify({"error": "Missing question or prompt"}), 400

    # Check if OpenAI client is available
    if client is None:
        return jsonify({"error": "OpenAI client not initialized. Check API key."}), 500

    scene_name = "GeneratedScene"
    script_id = uuid.uuid4().hex[:8]
    script_file = os.path.join(OUTPUT_DIR, f"{script_id}.py")

    # Format full prompt
    full_prompt = custom_prompt.replace("{QUESTION}", question).replace(
        "{SCENE_NAME}", scene_name
    )

    try:
        logger.info(f"Sending request to OpenAI for question: {question}")
        # Call OpenAI GPT-4
        try:
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": full_prompt}],
                temperature=0.3,
            )
            content = response.choices[0].message.content
            logger.info("Successfully received response from OpenAI")
        except Exception as api_error:
            logger.error(f"OpenAI API error: {str(api_error)}")
            return jsonify({"error": f"OpenAI API error: {str(api_error)}"}), 500

        code = extract_code(content)
        code = auto_fix_code(code)

        # Save the script
        with open(script_file, "w") as f:
            f.write(code)

        print(f"Generated script saved to {script_file}")
        # Render using Manim
        try:
            # Run Manim but don't check for errors since it might still generate the video
            subprocess.run(
                ["manim", "-pql", script_file, scene_name], capture_output=True
            )
        except Exception as e:
            print(f"Manim execution error: {str(e)}")
            # Continue anyway to check if video was generated despite errors

        # Get final video path
        video_path = os.path.join(
            VIDEO_DIR,
            os.path.splitext(os.path.basename(script_file))[0],
            f"{scene_name}.mp4",
        )

        # Wait a moment and check multiple times for the video file
        max_attempts = 5
        for attempt in range(max_attempts):
            if os.path.exists(video_path):
                break
            print(f"Video not found on attempt {attempt+1}, waiting...")
            # Wait a second before checking again
            subprocess.run(["sleep", "1"])

        if not os.path.exists(video_path):
            return (
                jsonify(
                    {
                        "error": "Video rendering failed - file not found after multiple attempts"
                    }
                ),
                500,
            )

        # Create a unique name for the video in static directory
        unique_video_name = f"{script_id}_{scene_name}.mp4"
        static_video_path = os.path.join(STATIC_DIR, unique_video_name)

        # Copy the video to static directory
        shutil.copy2(video_path, static_video_path)

        return jsonify(
            {
                "video_url": f"/video/{os.path.basename(os.path.dirname(video_path))}/{scene_name}.mp4",
                "static_video_url": f"/static/{unique_video_name}",
            }
        )

    except Exception as e:
        error_details = traceback.format_exc()
        logger.error(f"Error in generate endpoint: {str(e)}")
        logger.error(error_details)
        return jsonify({"error": str(e), "details": error_details}), 500


@app.route("/video/<folder>/<filename>")
def serve_video(folder, filename):
    return send_from_directory(os.path.join(VIDEO_DIR, folder), filename)


@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)


def extract_code(content: str) -> str:
    match = re.search(r"```python(.*?)```", content, re.DOTALL)
    if match:
        return match.group(1).strip()
    else:
        # If no code block is found, check if this is a conversational response
        if not content.strip().startswith(
            "from manim import"
        ) and not content.strip().startswith("import"):
            # This is likely not code at all
            return '# No valid code was generated\n\nfrom manim import *\n\nclass GeneratedScene(Scene):\n    def construct(self):\n        self.add(Text("Please provide a more specific math concept to visualize."))'
        return content.strip()


def auto_fix_code(code: str) -> str:
    # Remove `.T`
    code = re.sub(r"\.T\b", "", code)

    # Replace 1D Matrix([1, 2]) → Matrix([[1], [2]])
    def to_column(match):
        nums = [f"[{n.strip()}]" for n in match.group(1).split(",")]
        return f"Matrix([{', '.join(nums)}])"

    code = re.sub(r"Matrix\(\[([^\[\]]+?)\]\)", to_column, code)

    # Remove .dot() if mistakenly used
    code = re.sub(r"Matrix\(.*?\)\.dot\(.*?\)", "# Removed invalid .dot() usage", code)

    return code


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
