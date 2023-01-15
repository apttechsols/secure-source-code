import random

cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
user_cards =[]
computer_cards =[]
user_sum = 0
computer_sum = 0

def shuffle(cards):
    user1 = user_cards.append(random.choice(cards))
    user2 = user_cards.append(random.choice(cards))
    card1 = computer_cards.append(random.choice(cards))
    card2 = computer_cards.append(random.choice(cards))
    return

def new_card(cards):
    user3 = user_cards.append(random.choice(cards))
    card3 = computer_cards.append(random.choice(cards))
    return

def add_cards(user_cards, computer_cards):
    global user_sum
    user_sum = sum(user_cards)
    global computer_sum
    computer_sum = sum(computer_cards)
    return

def blackjack(user_sum, computer_sum):
    if user_sum > 21 and computer_sum > 21:
        return "You went over. You lose 😤"
    if user_sum == computer_sum:
        return "Draw 🙃"
    elif computer_sum == 0:
        return "Lose, opponent has Blackjack 😱"
    elif user_sum == 0:
        return "Win with a Blackjack 😎"
    elif user_sum > 21:
        return "You went over. You lose 😭"
    elif computer_sum > 21:
        return "Opponent went over. You win 😁"
    elif user_sum > computer_sum:
        return "You win 😃"
    else:
        return "You lose 😤"



first_input = input("Do you want to play Blackjack?: type y or no: \n").lower()
if first_input == 'y':
    shuffle(cards)
    print(user_cards)
    second_input = input("Do you wanna withdraw another card or pass?, Type y or n \n")
    if second_input =='y':
        new_card(cards)
        add_cards(user_cards, computer_cards)
        print(user_cards)
        print(blackjack(user_sum, computer_sum))
        print(f"Your opponent cards were: {computer_cards}")
    else: 
        add_cards(user_cards, computer_cards)
        print(user_cards)
        print(blackjack(user_sum, computer_sum))
        print(f"Your opponent cards were: {computer_cards}")
else:
    print("See you next time!!")