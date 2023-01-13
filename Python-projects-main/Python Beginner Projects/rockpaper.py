import random



options = ("rock","paper","scissors")
user_option = input("Choose: rock, paper or scissors?\n").lower()
computer_option = random.randint(0,2)

if user_option != 'rock' and user_option != 'paper' and user_option !='scissors':
    print("Wrong Input, Please try again later")

if user_option == "rock" and computer_option == 0:
    print("computer choosed: ROCK")
    print("Its a Draw")
elif user_option == "rock" and computer_option == 1:
    print ("computer choosed: PAPER")
    print("You Lost")
elif user_option == "rock" and computer_option == 2:
    print(" Computer choosed: SCISSORS")
    print("Congrats! You have won")


if user_option == "paper" and computer_option == 0:
    print("computer choosed: ROCK")
    print("Congrats! You Win")
elif user_option == "paper" and computer_option == 1:
    print ("computer choosed: PAPER")
    print("Its a Draw")
elif user_option == "paper" and computer_option == 2:
    print(" Computer choosed: SCISSORS")
    print("You Lost")



if user_option == "scissors" and computer_option == 0:
    print("computer choosed: ROCK")
    print("You Lost")
elif user_option == "scissors" and computer_option == 1:
    print ("computer choosed: PAPER")
    print("Congrats! You Win")
elif user_option == "scissors" and computer_option == 2:
    print(" Computer choosed: SCISSORS")
    print("Its a Draw")


