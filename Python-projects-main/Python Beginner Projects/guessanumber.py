import random
lives = 0
guessed_number = 0

def easy():
    global lives
    global guessed_number
    lives = 10
    guessed_number = random.randint(1,50)
    return

def medium():
    global lives
    global guessed_number
    lives = 8
    guessed_number = random.randint(1,70)
    return

def hard():
    global lives
    global guessed_number
    lives = 5
    guessed_number = random.randint(1,100)
    return


def second_chance():
    second_input = int(input("Please guess again: \n"))
    compare(second_input)
    return second_input


def compare(user_guess):
    global lives
    if lives == 1:
        print("You ran out of lives, Better luck next time")
    else:
        if user_guess == guessed_number:
            print ("You won!!! 😄")
        elif user_guess > guessed_number:
            lives -= 1
            print ("Too High, Try again")
            print(f"You have {lives} more chances")
            second_chance()
        elif user_guess < guessed_number:
            lives -= 1
            print("Too Low, Try again")
            print(f"You have {lives} more chances")
            second_chance()
    return


initial_loop = True
while initial_loop == True:
    level = input("Do You want to play easy, medium or hard?\n")
    if level =='easy':
        initial_loop = False
        print(f"You have {lives} chances")
        first_guess = int(input("Guess a number:\n"))
        easy()
        compare(first_guess)
    elif level =='medium':
        print(f"You have {lives} chances")
        initial_loop = False
        first_guess = int(input("Guess a number:\n"))
        medium()
        compare(first_guess)
    elif level =='hard':
        print(f"You have {lives} chances")
        initial_loop = False
        first_guess = int(input("Guess a number:\n"))
        hard()
        compare(first_guess)
    else:
        
        print("Invalid Response, try again")
        initial_loop = True

    
    

    