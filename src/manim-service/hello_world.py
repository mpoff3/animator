from manim import *

class HelloWorld(Scene):
    def construct(self):
        # Create text object
        hello_world = Text("Hello, World!", font_size=72)
        
        # Animation sequence
        self.play(Write(hello_world))
        self.wait(1)
        self.play(
            hello_world.animate.set_color_by_gradient(BLUE, GREEN, YELLOW, RED),
            run_time=2
        )
        self.wait(1)
        self.play(FadeOut(hello_world))
        self.wait(0.5)

if __name__ == "__main__":
    print("Running Manim Hello World animation...")
