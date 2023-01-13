#importing turtle to create snake, each segment of snake is made of Turtle
from turtle import Turtle
#to initialize the snake
STARTING_POSITION =[(0,0),(-20,0),(-40,0),(-60,0)]
MOVE_DISTANCE = 15
UP = 90
DOWN = 270
LEFT = 180
RIGHT = 0
class Snake(Turtle):
    def __init__(self):
        super().__init__()
        self.segments = []
        self.snake_ready()
    #this is first step to create snake
    def snake_ready(self):
        for position in STARTING_POSITION:
            new_seg = Turtle('square')
            new_seg.color('white')
            new_seg.penup()
            new_seg.goto(position)
            self.segments.append(new_seg)
    #this part will ensure snake movement
    def snake_movement(self):
        for segment in range(len(self.segments)-1,0,-1):
            new_x = self.segments[segment-1].xcor()
            new_y = self.segments[segment-1].ycor()
            self.segments[segment].goto(new_x,new_y)
        self.segments[0].color("red")
        self.segments[0].shape("circle")
        self.segments[0].forward(MOVE_DISTANCE)
    #this will increase size of snake when snake will touch the food
    def snake_size(self):
            new_seg = Turtle('square')
            new_seg.color('white')
            new_seg.penup()
            self.segments.append(new_seg)
    #the following functions are ensuring snake direction for movement
    def up(self):
        if self.segments[0].heading() != DOWN:
            self.segments[0].setheading(UP)
    
    def down(self):
        if self.segments[0].heading() != UP:
            self.segments[0].setheading(DOWN)

    def right(self):
        if self.segments[0].heading() != LEFT:
            self.segments[0].setheading(RIGHT)
    
    def left(self):
        if self.segments[0].heading() != RIGHT:
            self.segments[0].setheading(LEFT)


            
            
        


