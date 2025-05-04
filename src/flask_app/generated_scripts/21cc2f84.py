from manim import *

class SquareToCircle(Scene):
    def construct(self):
        circle = Circle()  # create a circle
        circle.set_fill(PINK, opacity=0.5)  # set color and transparency

        square = Square()  # create a square
        square.rotate(PI / 4)  # rotate the square

        self.play(GrowFromCenter(square))  # animate the growth of the square
        self.play(Transform(square, circle))  # transform the square into the circle
        self.play(FadeOut(square))  # fade out animation