from turtle import Turtle, Screen
import random
screen = Screen()
screen.setup(width=500,height=400)
is_race_on = False
user_bet =screen.textinput(title='Make a bet', prompt='Which turtle will win the race?, Pick a Color:')
colors =['red','blue','pink','green','yellow','purple']
y_positions = [-150,-120,-90,-60,-30,0]
all_turtles =[]
for turtle_index in range(0,6):
    new_turtle = Turtle(shape='turtle')
    new_turtle.color(colors[turtle_index])
    new_turtle.penup()
    new_turtle.goto(x =-230, y= y_positions[turtle_index])
    all_turtles.append(new_turtle)


if user_bet:
    is_race_on = True


# while is_race_on:
#     for turtle in all_turtles:
#         if turtle.xcor() > 230:
#             is_race_on = False
#             print('flag3')
#             winning_color = turtle.pencolor()
#             if user_bet == winning_color:
#                 print(f"You have won! The {winning_color} turtle is the winner")
#             else:
#                 print(f"You have Lost! The {winning_color} turtle is the winner")
#           speed = random.randint(0,15)
#           turtle.forward(speed)


while is_race_on:
    for turtle in all_turtles:
        #230 is 250 - half the width of the turtle.
        if turtle.xcor() > 230:
            is_race_on = False
            winning_color = turtle.pencolor()
            if winning_color == user_bet:
                print(f"You've won! The {winning_color} turtle is the winner!")
            else:
                print(f"You've lost! The {winning_color} turtle is the winner!")

        #Make each turtle move a random amount.
        rand_distance = random.randint(0, 5)
        turtle.forward(rand_distance)
screen.exitonclick()