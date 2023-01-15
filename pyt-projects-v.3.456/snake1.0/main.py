import time
from turtle import Turtle, Screen, xcor
from snake import Snake
from food import Food
from score import Score
#importing snake here to access the snake class
snake = Snake()
food = Food()
score = Score()


#setting up the screen for snake and to move it around
screen = Screen()
screen.setup(width=600,height=600)
screen.bgcolor('black')
screen.title("My Snake Game")
screen.tracer(0)
screen.listen()
screen.onkey(snake.up, 'Up')
screen.onkey(snake.down, 'Down')
screen.onkey(snake.left, 'Left')
screen.onkey(snake.right, 'Right')


#importing the food, if we import before screen it will lag the animation



is_game_on = True
while is_game_on:
    screen.update()
    time.sleep(0.1)
    snake.snake_moving()
    # detect collisio with food:
    if snake.head.distance(food)<20:
        food.location()
        snake.snake_size()
        score.score_increase()
    #collision with wall
    if snake.head.xcor()>300 or snake.head.xcor() <-300 or snake.head.ycor() >300 or snake.head.ycor()<-300:
        is_game_on = False
        score.game_over()

    for segment in snake.segment[1:]:
        # if segment == snake.head:
        #     pass
        # elif snake.head.distance(segment)<10:
        #     is_game_on = False
        #     score.game_over()

        if snake.head.distance(segment) <10:
            is_game_on = False
            score.game_over()
        
    

        



screen.exitonclick()