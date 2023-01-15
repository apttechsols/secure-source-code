#importing all the classes and the classes we created to get the game running
import time
import random
from turtle import Turtle, Screen
import turtle
#Snake class
from snake import Snake
#Food Class
from food import Food
# Score Class
from score import Score
# Wall Class
from walls import *
# Initiallizing the game
snake = Snake()
screen = Screen()
food = Food()
score = Score()
wall = Wall()
# Loop to keep game running
is_game_on = True


#The following function will check if snake hit the wall, food, or his own tail
def crash():
    #collision if snake goes out of screen
    if snake.segments[0].xcor() > 400 or snake.segments[0].xcor()<-400 or snake.segments[0].ycor()>400 or snake.segments[0].ycor()<-400:
            global is_game_on
            is_game_on = False
            score.game_over()
    if snake.segments[0].distance(food) <20:
        score.score_update()
        snake.snake_size()
        food.food_location()
        # checking collision with wall for food, relocate food
        for wall_seg in wall.wall_segment:
            if food.distance(wall_seg)<20:
                food.food_location()
                
    for segment in snake.segments[1:]:
        if snake.segments[0].distance(segment)<10:
            is_game_on = False
            score.game_over()
    
    # checking collision with wall, game over
    for wall_seg in wall.wall_segment:
        if snake.segments[0].distance(wall_seg)<10:
            is_game_on = False
            score.game_over()  

# if user chooses to play easy level

def easy():
    snake.snake_movement()
    crash()
            
# if user chooses to play medium level
# run_once is created to stop the obstacles to go in loop, if we dont include this, when we play game it will keep creating the walls
run_once = 0
def medium():
    snake.snake_movement()
    crash()
    global run_once
    while run_once == 0:
        if run_once == 0:
            wall.medium_wall()
            run_once =1

# if user chooses to play Hard level
# run_once is created to stop the obstacles to go in loop, if we dont include this, when we play game it will keep creating the walls 
def hard():
    snake.snake_movement()
    crash()
    global run_once
    while run_once == 0:
        if run_once == 0:
            wall.hard_wall()
            run_once = 1
    




# To get input from User
user_level = turtle.textinput("What level do you want to play?","Easy, Medium or Hard").lower()

while is_game_on:
    # Screen settings
    screen.bgcolor('black')
    screen.screensize(600,600)
    screen.tracer(0)
    screen.listen()
    screen.onkey(snake.up,'Up')
    screen.onkey(snake.down,'Down')
    screen.onkey(snake.right,'Right')
    screen.onkey(snake.left,'Left')
    screen.update()
    time.sleep(0.1)
    # Initializing level
    if user_level == 'easy':
        easy()
    elif user_level =='medium':
        medium()
    elif user_level == 'hard':
        hard()

        



screen.exitonclick()