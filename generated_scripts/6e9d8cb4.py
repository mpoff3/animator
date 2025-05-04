from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Step 1: Introduction to Pythagorean theorem
        intro_text = Text("Pythagorean Theorem")
        self.play(Write(intro_text))
        self.wait(1)
        self.play(FadeOut(intro_text))

        # Step 2: Show the formula
        formula = MathTex("a^2", "+", "b^2", "=", "c^2")
        self.play(Write(formula))
        self.wait(2)

        # Step 3: Explanation of the formula
        explanation = Text("In a right-angled triangle,")
        explanation2 = Text("the square of the hypotenuse (c) is")
        explanation3 = Text("equal to the sum of the squares of the other two sides (a and b).")
        explanation.next_to(formula, UP)
        explanation2.next_to(explanation, DOWN)
        explanation3.next_to(explanation2, DOWN)
        self.play(Write(explanation), Write(explanation2), Write(explanation3))
        self.wait(2)
        self.play(FadeOut(explanation), FadeOut(explanation2), FadeOut(explanation3))

        # Step 4: Show a right-angled triangle
        triangle = Polygon([0,0,0], [1,0,0], [0,1,0], fill_opacity=0.3)
        labels = VGroup(MathTex("a").next_to(triangle, LEFT), MathTex("b").next_to(triangle, DOWN), MathTex("c").next_to(triangle, RIGHT))
        self.play(Create(triangle), Write(labels))
        self.wait(2)

        # Step 5: Show how the squares of the sides relate
        squares = VGroup(Square(side_length=0.5).next_to(labels[0], LEFT), Square(side_length=0.7).next_to(labels[1], DOWN), Square(side_length=1).next_to(labels[2], RIGHT))
        self.play(Create(squares))
        self.wait(2)

        # Step 6: Conclusion
        conclusion = Text("This is the Pythagorean Theorem.").to_edge(DOWN)
        self.play(Write(conclusion))
        self.wait(2)