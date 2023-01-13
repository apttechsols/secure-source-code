print(" Welcome to the Treasure Island. \n Your Mission is to find treasure.")
direction = str(input("Which Direction you would like to go?")).upper()
if direction == 'RIGHT':
    print("Game Over, Snake killed you!")
else:
    step2 = str(input("DO You want to SWIM or WAIT?\n")).upper()
    if step2 =="SWIM":
        print("Game Over, Crocodile ate you.")
    else:
        step3 = str(input("Do you want to go through RED, YELLOW or BLUE Door?\n")).upper()
        if step3 =="YELLOW":
            print("Congrats! You have won $1 MILLION in treasure")
        else:
            print("Game Over, You are attacked by a Creature. Better Luck next time")
