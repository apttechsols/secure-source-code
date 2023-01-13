from operator import imod
from turtle import Turtle, Screen
score = 0
class Score(Turtle):
    def __init__(self):
        super().__init__()
        
        self.hideturtle()
        self.shape()
        self.color('white')
        self.penup()
        self.goto(x = 0, y = 270)
        self.write(f"Score: 0", align='center', font= ('Arial',20,'normal'))
        

        
        
    def score_increase(self):
        global score 
        score+=1
        self.clear()
        self.hideturtle()
        self.shape()
        self.color('white')
        self.penup()
        self.goto(x = 0, y = 270)
        self.write(f"Score: {score}", align='center', font= ('Arial',20,'normal'))
        # self.shape()
        # self.color('white')
        # self.penup()
        # self.goto(x = 50, y = 270)
        # self.write("lykykky", False, align= 'center', font=('Arial', 20, 'normal'))
        
    def game_over(self):
        self.hideturtle()
        self.shape()
        self.color('white')
        self.penup()
        self.goto(x = 0, y = 0)
        self.write(f"Game Over", align='center', font= ('Arial',20,'normal'))
        
        