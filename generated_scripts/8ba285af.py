from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Step 1: Introduce the theorem
        intro_text = Text("The Pythagorean Theorem states:")
        self.play(Write(intro_text))
        self.wait(1)

        # Step 2: Show the theorem
        theorem = MathTex("a^2", "+", "b^2", "=", "c^2")
        self.play(Transform(intro_text, theorem))
        self.wait(1)

        # Step 3: Explain the theorem
        explanation = Text("In a right triangle, the square of the length of the hypotenuse (c) is equal to the sum of the squares of the other two sides (a and b).")
        explanation.next_to(theorem, DOWN)
        self.play(Write(explanation))
        self.wait(2)

        # Step 4: Show a right triangle
        triangle = Polygon([0, 0, 0], [1, 0, 0], [0, 1, 0])
        triangle.shift(2*LEFT + DOWN)
        self.play(Create(triangle))
        self.wait(1)

        # Step 5: Label the sides of the triangle
        labels = VGroup(MathTex("a").next_to(triangle, LEFT), MathTex("b").next_to(triangle, UP), MathTex("c").next_to(triangle, RIGHT))
        self.play(Write(labels))
        self.wait(1)

        # Step 6: Show the squares of the sides
        squares = VGroup(Square().scale(0.5).next_to(labels[0], LEFT), Square().scale(0.5).next_to(labels[1], UP), Square().scale(0.5).next_to(labels[2], RIGHT))
        self.play(Create(squares))
        self.wait(1)

        # Step 7: Show the equation with the squares
        equation = MathTex("a^2", "+", "b^2", "=", "c^2")
        equation.next_to(squares, DOWN)
        self.play(Write(equation))
        self.wait(2)

        # Step 8: Fade out everything
        self.play(FadeOut(VGroup(intro_text, theorem, explanation, triangle, labels, squares, equation)))
        self.wait(1)

        # Step 9: Show the final answer
        final_text = Text("This is the Pythagorean Theorem!")
        self.play(Write(final_text))
        self.wait(2)