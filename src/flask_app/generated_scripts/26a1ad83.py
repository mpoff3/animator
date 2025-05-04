from manim import *

class MultiplyTwoNumbers(Scene):
    def construct(self):
        # Create the matrices
        matrix1 = Matrix([[3]], h_buff=1.3)
        matrix2 = Matrix([[4]], h_buff=1.3)

        # Create the multiplication symbol
        multiply = MathTex("\\times")

        # Create the equals symbol
        equals = MathTex("=")

        # Create the result
        result = Matrix([[12]], h_buff=1.3)

        # Arrange everything
        multiply.next_to(matrix1, RIGHT)
        matrix2.next_to(multiply, RIGHT)
        equals.next_to(matrix2, RIGHT)
        result.next_to(equals, RIGHT)

        # Add everything to the scene
        self.play(Write(matrix1), Write(multiply), Write(matrix2), Write(equals), Write(result))

        # Wait for 3 seconds before ending
        self.wait(3)