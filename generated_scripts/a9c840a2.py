from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Step 1: Introduce the theorem
        intro_text = Text("Pythagorean Theorem: a² + b² = c²")
        self.play(Write(intro_text))
        self.wait(1)

        # Step 2: Explain the terms
        terms_text = Text("Where a and b are the lengths of the legs, and c is the hypotenuse.")
        terms_text.next_to(intro_text, DOWN)
        self.play(Write(terms_text))
        self.wait(1)

        # Step 3: Draw a right triangle
        triangle = Polygon([0,0,0], [1,0,0], [0,1,0], fill_opacity=0.3)
        triangle.next_to(terms_text, DOWN)
        self.play(Create(triangle))
        self.wait(1)

        # Step 4: Label the sides
        a_label = MathTex("a").next_to(triangle, LEFT)
        b_label = MathTex("b").next_to(triangle, DOWN)
        c_label = MathTex("c").next_to(triangle, RIGHT)
        self.play(Write(a_label), Write(b_label), Write(c_label))
        self.wait(1)

        # Step 5: Show the squares
        a_square = Square(1, fill_opacity=0.3).next_to(triangle, RIGHT)
        b_square = Square(1, fill_opacity=0.3).next_to(a_square, RIGHT)
        c_square = Square(1.41, fill_opacity=0.3).next_to(b_square, RIGHT)
        self.play(Create(a_square), Create(b_square), Create(c_square))
        self.wait(1)

        # Step 6: Label the squares
        a_square_label = MathTex("a^2").move_to(a_square.get_center())
        b_square_label = MathTex("b^2").move_to(b_square.get_center())
        c_square_label = MathTex("c^2").move_to(c_square.get_center())
        self.play(Write(a_square_label), Write(b_square_label), Write(c_square_label))
        self.wait(1)

        # Step 7: Show the equation
        equation = MathTex("a^2", "+", "b^2", "=", "c^2")
        equation.next_to(c_square, RIGHT)
        self.play(Write(equation))
        self.wait(2)

        # Fade out all elements
        self.play(FadeOut(intro_text), FadeOut(terms_text), FadeOut(triangle), FadeOut(a_label), FadeOut(b_label), FadeOut(c_label),
                  FadeOut(a_square), FadeOut(b_square), FadeOut(c_square), FadeOut(a_square_label), FadeOut(b_square_label),
                  FadeOut(c_square_label), FadeOut(equation))
        self.wait(1)