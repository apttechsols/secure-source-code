from imp import source_from_cache
from turtle import Turtle
import random
from typing_extensions import Self

class Food(Turtle):
    def __init__(self):
        super().__init__()
        self.shape("circle")
        self.penup()
        self.shapesize(0.5,0.5)
        self.color('red')
        self.speed('fastest')
        self.location()
    
    def location(self):
        x = random.randint(-250,250)
        y = random.randint(-250,250)
        self.goto(x,y)