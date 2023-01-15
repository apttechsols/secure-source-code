import imp
from turtle import Turtle
STARTING_POSITION =[(0,0),(-20,0),(-40,0)]
MOVE_DISTANCE = 20
UP = 90
DOWN = 270
LEFT = 180
RIGHT = 0

class Snake:
    def __init__(self):
        self.segment = []
        self.snake_is_ready()
        self.head = self.segment[0]
        
        pass
    def snake_is_ready(self):

        for position in STARTING_POSITION:
            new_segment = Turtle('square')
            new_segment.color('white')
            new_segment.penup()
            new_segment.goto(position)
            self.segment.append(new_segment)
    
    def snake_moving(self):
        for seg_num in range(len(self.segment)-1, 0, -1):
            new_x = self.segment[seg_num-1].xcor()
            new_y = self.segment[seg_num-1].ycor()
            self.segment[seg_num].goto(new_x,new_y)
        self.head.forward(MOVE_DISTANCE)
    
    def snake_size(self):
        new_segment = Turtle('square')
        new_segment.color('white')
        new_segment.penup()
        self.segment.append(new_segment)

    def up(self):
        if self.head.heading() != DOWN:
            self.head.setheading(UP)
    def down(self):
        if self.head.heading() != UP:
            self.head.setheading(DOWN)
    def right(self):
        if self.head.heading() != LEFT:
         self.head.setheading(RIGHT)
    def left(self):
        if self.head.heading() != RIGHT:
            self.head.setheading(LEFT)