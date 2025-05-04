from manim import *

class MatrixMultiplication(Scene):
    def construct(self):
        title = Title("Matrix and Vector Multiplication")

        matrix = MathTex(r"\begin{bmatrix} 2 & 3 \\ 4 & 5 \end{bmatrix}")
        vector = MathTex(r"\begin{bmatrix} x \\ y \end{bmatrix}")
        equals = MathTex("=")
        result = MathTex(r"\begin{bmatrix} 2x + 3y \\ 4x + 5y \end{bmatrix}")

        matrix.next_to(title, DOWN)
        vector.next_to(matrix, RIGHT)
        equals.next_to(vector, RIGHT)
        result.next_to(equals, RIGHT)

        self.play(Write(title))
        self.wait(1)
        self.play(Write(matrix), Write(vector))
        self.wait(1)
        self.play(Write(equals), Write(result))
        self.wait(1)

        explanation1 = MathTex(r"2 \cdot x + 3 \cdot y")
        explanation2 = MathTex(r"4 \cdot x + 5 \cdot y")

        explanation1.next_to(matrix, DOWN)
        explanation2.next_to(explanation1, DOWN)

        self.play(Write(explanation1), Write(explanation2))
        self.wait(2)

        self.play(FadeOut(explanation1), FadeOut(explanation2))
        self.wait(1)

        final_result = MathTex(r"\begin{bmatrix} 2x + 3y \\ 4x + 5y \end{bmatrix}")
        final_result.next_to(title, DOWN)

        self.play(ReplacementTransform(matrix, final_result))
        self.wait(2)