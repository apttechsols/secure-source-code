import imp
from math import fabs
import os
def clearConsole():
    command = 'clear'
    if os.name in ('nt', 'dos'):  # If Machine is running on Windows, use cls
        command = 'cls'
    os.system(command)
def highest_bid(bid_dict):
    highest_bid = 0
    winner =""
    for bid in bid_dict:
        bid_amount = bid_dict[bid]
        if bid_amount > highest_bid:
            highest_bid = bid_amount
            winner = bid
    second_loop = False
    print(f"The winner is:{winner} with bid amount of:{highest_bid}")
print("Welcome to the Bid Program")

name = input("Please type your name: \n").upper()
bid = float(input("Please input your bid $: \n").replace('$','').strip())
bid_dict = {name:bid}
initial_loop = True
while initial_loop == True:
    
    second_loop = True
    while second_loop == True:
        another_person = input("Is there another person, Please type yes or no: \n").lower()
        if another_person == 'yes':
            clearConsole()
            initial_loop = True
            second_loop = False
            name = input("Please type your name: \n").upper()
            bid = float(input("Please input your bid $: \n").replace('$','').strip())
            bid_dict[name] = bid
        elif another_person == 'no':
            initial_loop = False
            second_loop = False
            print(highest_bid(bid_dict))
            





