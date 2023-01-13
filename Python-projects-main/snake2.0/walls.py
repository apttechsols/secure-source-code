from hashlib import new
from operator import index
from turtle import Turtle
import random
class Wall(Turtle):
    def __init__(self):
        super().__init__()
        self.wall_segment =[]
        
    
        pass
# if user chooses medium level, this will create two walls on random location on screen
    def medium_wall(self):
        for _ in range(0,2):
            x = random.randint(-250,250)
            y = random.randint(-250,250)
            for wall in range(0,9):
                wall = Turtle('square')
                wall.color('blue')
                wall.penup()
                y -=20
                wall.goto(x,y)
                self.wall_segment.append(wall.position()) # this will create a list of wall segment location, we are using this to check collision further 
        

      
# if user chooses hard level, this will create 9 random obstacles on screen        
    def hard_wall(self):
        for _ in range(0,9):
            x = random.randint(-250,250)
            y = random.randint(-250,250)
            for obstacle in range(0,2):
                obstacle = Turtle('square')
                obstacle.color('blue')
                obstacle.penup()
                x = x-20
                obstacle.goto(x,y)
                self.wall_segment.append(obstacle.position()) # this will create a list of wall segment location, we are using this to check collision further 
       
                

                

        