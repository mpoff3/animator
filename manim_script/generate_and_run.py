import os
import subprocess
import re
from openai import OpenAI

# Make sure your OPENAI_API_KEY is set in the environment
client = OpenAI()

QUESTION = "How do you multiply a matrix with a vector?"
SCENE_NAME = "MatrixVectorScene"
OUTPUT_FILE = "generated_scene.py"

PROMPT = f"""
You're an expert math educator and Manim CE programmer.

Create a **complete and runnable Manim CE script** that visually explains the following question step by step:

**Question:** "{QUESTION}"

🎯 Goals:
- Define a class called {SCENE_NAME} that inherits from `Scene`
- Use **clear visuals**, like Matrix() objects, arrows, highlights, and MathTex for symbolic steps
- Visually walk through each **step of the concept**, from setup to final answer
- Show intermediate symbolic steps (like dot products) using MathTex:
    e.g. MathTex(r"2*5 + 3*(-2) = 4")
- Use `Text()` or `MathTex()` captions to explain what's happening
- Arrange visuals on screen so they don’t overlap
- Use `Create`, `Write`, `FadeOut`, and color animations to guide the viewer's attention
- Add short pauses (`wait(1)` or `wait(2)`) after each explanation step

🧠 Constraints:
- Use **symbolic math**, not numerical computation (no `.dot()` or `numpy`)
- Only use `Matrix()` for visual representation
- Keep the animation polished and focused — don’t crowd the screen

📦 Final output:
Respond **only with valid Python code**, using standard Manim CE. No comments or markdown.
"""


import re

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

def generate_manim_code():
    print("🧠 Generating Manim script with GPT...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": PROMPT}],
        temperature=0.3,
    )
    content = response.choices[0].message.content
    # Extract code from markdown-style triple backticks
    match = re.search(r"```python(.*?)```", content, re.DOTALL)
    return match.group(1).strip() if match else content.strip()

def save_code(code: str):
    with open(OUTPUT_FILE, "w") as f:
        f.write(code)
    print(f"✅ Saved generated code to {OUTPUT_FILE}")

def render_scene():
    print("🎬 Running Manim to render the scene...")
    subprocess.run(["manim", "-pql", OUTPUT_FILE, SCENE_NAME])

if __name__ == "__main__":
    manim_code = auto_fix_code(generate_manim_code())
    save_code(manim_code)
    render_scene()
