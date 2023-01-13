import imp
from turtle import Turtle
SCORE = 0
class Score(Turtle):
    def __init__(self):
        super().__init__()
        # score turtle
        self.penup()
        self.goto(-10, 300)
        self.speed('fastest')
        self.color('white')
        self.hideturtle()
        self.write("Score: 0",align='center', font=('arial', 20, 'normal'))
        
    def score_update(self):
        # this will update the score
        global SCORE
        SCORE +=1
        self.clear()
        self.speed('fastest')
        self.penup()
        self.goto(-10, 300)
        self.color('white')
        self.hideturtle()
        self.write(f"Score: {SCORE}",align='center', font=('arial', 20, 'normal'))
    
    def game_over(self):
        # this turtle will be accessed when game is over
        self.speed('fastest')
        self.penup()
        self.goto(0,0)
        self.color('white')
        self.hideturtle()
        self.write(f"Game Over",align='center', font=('arial', 20, 'normal'))
