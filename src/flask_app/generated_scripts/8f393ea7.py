from manim import *

class MatrixVectorMultiplication(Scene):
    def construct(self):
        title = Title("Matrix and Vector Multiplication")

        matrix = Matrix(
            [[2, 3],
             [1, 4]]
        )
        matrix_label = MathTex("A =")
        matrix_group = VGroup(matrix_label, matrix).arrange(RIGHT)

        vector = Matrix(
            [[1],
             [2]]
        )
        vector_label = MathTex("v =")
        vector_group = VGroup(vector_label, vector).arrange(RIGHT)

        equals = MathTex("=")

        result_vector = Matrix(
            [[8],
             [9]]
        )
        result_label = MathTex("Av =")
        result_group = VGroup(result_label, result_vector).arrange(RIGHT)

        self.play(Write(title))
        self.wait(1)
        self.play(Write(matrix_group))
        self.wait(1)
        self.play(Write(vector_group))
        self.wait(1)
        self.play(Write(equals))
        self.wait(1)
        self.play(Write(result_group))
        self.wait(1)

        explanation = MathTex(
            "2 \\cdot 1 + 3 \\cdot 2 = 8 \\\\",
            "1 \\cdot 1 + 4 \\cdot 2 = 9"
        )
        self.play(Write(explanation))
        self.wait(2)