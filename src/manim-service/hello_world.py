from manim import *
import os
import sys

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
    # Set up command line arguments for manim to render as mp4
    output_file = "hello_world_animation.mp4"
    os.environ["PYTHONPATH"] = os.getcwd()
    sys.argv = ["manim", __file__, "HelloWorld", "-o", output_file, "--media_dir", "./media"]
    
    # Import and run the manim CLI
    from manim.__main__ import main
    main()
    
    print(f"Animation saved as {output_file} in the media directory")
