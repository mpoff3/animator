from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Step 1: Introduce the Pythagorean theorem
        step1 = Text("Step 1: The Pythagorean theorem relates the sides of a right triangle.")
        self.play(Write(step1))
        self.wait(1)
        self.play(FadeOut(step1))

        # Step 2: Draw a right triangle
        step2 = Text("Step 2: Let's draw a right triangle.")
        triangle = Polygon([0, 0, 0], [1, 0, 0], [0, 1, 0])
        self.play(Write(step2), Create(triangle))
        self.wait(1)
        self.play(FadeOut(step2))

        # Step 3: Label the sides of the triangle
        step3 = Text("Step 3: Label the sides a, b, and c.")
        labels = VGroup(MathTex("a").next_to(triangle, LEFT), 
                         MathTex("b").next_to(triangle, DOWN), 
                         MathTex("c").next_to(triangle, UP+RIGHT))
        self.play(Write(step3), Write(labels))
        self.wait(1)
        self.play(FadeOut(step3))

        # Step 4: State the theorem
        step4 = Text("Step 4: The theorem states that a^2 + b^2 = c^2.")
        theorem = MathTex("a^2", "+", "b^2", "=", "c^2").next_to(labels, DOWN)
        self.play(Write(step4), Write(theorem))
        self.wait(1)
        self.play(FadeOut(step4))

        # Step 5: Show the theorem visually
        step5 = Text("Step 5: This means the square of the hypotenuse equals the sum of the squares of the other two sides.")
        squares = VGroup(Square().scale(0.5).next_to(triangle, LEFT).set_fill(color=BLUE, opacity=0.5), 
                         Square().scale(0.5).next_to(triangle, DOWN).set_fill(color=RED, opacity=0.5), 
                         Square().scale(0.5).next_to(triangle, UP+RIGHT).set_fill(color=YELLOW, opacity=0.5))
        self.play(Write(step5), Create(squares))
        self.wait(1)
        self.play(FadeOut(step5))

        # Step 6: Conclude the explanation
        step6 = Text("Step 6: And that's the Pythagorean theorem!")
        self.play(Write(step6))
        self.wait(1)
        self.play(FadeOut(step6), FadeOut(triangle), FadeOut(labels), FadeOut(theorem), FadeOut(squares))