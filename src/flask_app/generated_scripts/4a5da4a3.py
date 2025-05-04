from manim import *

class MatrixVectorMultiplication(Scene):
    def construct(self):
        title = Title("Matrix and Vector Multiplication")

        matrix = Matrix([[2, 3], [1, 4]])
        matrix_label = MathTex("A = ")
        matrix_group = VGroup(matrix_label, matrix).arrange(RIGHT)
        matrix_group.to_corner(UP+LEFT)

        vector = Matrix([[1], [2]])
        vector_label = MathTex("v = ")
        vector_group = VGroup(vector_label, vector).arrange(RIGHT)
        vector_group.next_to(matrix_group, DOWN, aligned_edge=LEFT)

        result = Matrix([[8], [9]])
        result_label = MathTex("Av = ")
        result_group = VGroup(result_label, result).arrange(RIGHT)
        result_group.next_to(vector_group, DOWN, aligned_edge=LEFT)

        self.play(Write(title))
        self.wait(1)
        self.play(Write(matrix_group))
        self.wait(1)
        self.play(Write(vector_group))
        self.wait(1)
        self.play(Write(result_group))
        self.wait(2)

        explanation = MathTex(r"Av = \begin{bmatrix} 2 & 3 \\ 1 & 4 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 2*1+3*2 \\ 1*1+4*2 \end{bmatrix} = \begin{bmatrix} 8 \\ 9 \end{bmatrix}")
        explanation.next_to(result_group, DOWN)
        explanation.to_edge(LEFT, buff=1)

        self.play(Write(explanation))
        self.wait(2)