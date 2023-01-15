from random import randint
import random
from turtle import Turtle


class Food(Turtle):
    def __init__(self):
        super().__init__()
        # create turtle for food
        self.speed('fastest')
        self.color('red')
        self.shape('circle')
        self.shapesize(0.5,0.5)
        self.penup()
        self.food_location()
        
# this will change the location of food, when snake touches the food
    def food_location(self):
        x = random.randint(-270,270)
        y = random.randint(-270,270)
        self.speed('fastest')
        self.goto(x,y)