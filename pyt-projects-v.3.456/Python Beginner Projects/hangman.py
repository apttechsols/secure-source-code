import random
word_list =["waheguru","satnam","akaal","nanak","gobind","ajit","fateh"]
chosen_word = random.choice(word_list)
lives = 6

display = []
for letter in chosen_word:
    display += "_"
print(display)

stages = ['''
  +---+
  |   |
  O   |
 /|\  |
 / \  |
      |
=========
''', '''
  +---+
  |   |
  O   |
 /|\  |
 /    |
      |
=========
''', '''
  +---+
  |   |
  O   |
 /|\  |
      |
      |
=========
''', '''
  +---+
  |   |
  O   |
 /|   |
      |
      |
=========''', '''
  +---+
  |   |
  O   |
  |   |
      |
      |
=========
''', '''
  +---+
  |   |
  O   |
      |
      |
      |
=========
''', '''
  +---+
  |   |
      |
      |
      |
      |
=========
''']


end_of_game = False

while not end_of_game:
    user_guess = input("Please guess Letter to begin: \n").lower()
    for position in range(len(chosen_word)):
        guess = chosen_word[position]
        if guess == user_guess:
            display[position]=guess

    print(display) 

    if user_guess not in chosen_word:
        lives -= 1
        if lives ==0:
            end_of_game = True
            print("You Lost!!")
    if "_" not in display:
        end_of_game = True
        print("\nYou Win!!")
     
    print(stages[lives])