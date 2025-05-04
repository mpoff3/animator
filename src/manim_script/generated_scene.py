from manim import *

class MatrixVectorScene(Scene):
    def construct(self):
        matrix = Matrix([[2, -1], [3, 4]])
        vector = Matrix([[1], [2]])
        
        self.play(Create(matrix))
        self.play(Create(vector))
        self.wait(1)
        
        result = Matrix([[2*1 + (-1)*2], [3*1 + 4*2]])
        result.move_to([2, 0, 0])
        
        self.play(Transform(matrix.copy(), result))
        self.wait(1)
        
        final_result = Matrix([[0], [11]])
        final_result.move_to([2, 0, 0])
        
        self.play(Transform(result.copy(), final_result))
        self.wait(1)