from cgi import test
from operator import index
from turtle import position


print(" Welcome to the Ceasor Cispher")
letters = [' ',',','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
def encode(message, position_shift):
    msg_letters =[]
    return_msg=[]

    for char in message:
        msg_letters += char
    for position in msg_letters:
        index = letters.index(position)
        index += position_shift
        return_msg.append(letters[index])
    for new_msg in return_msg:
        new_msg = ''.join(return_msg)
    print(f'Your Encoded message is:  {new_msg}')
  
    
        

def decode(message, position_shift):
    msg_letters =[]
    return_msg=[]
    for char in message:
        msg_letters += char
    for position in msg_letters:
        index = letters.index(position)
        index -= position_shift
        return_msg.append(letters[index])
    for new_msg in return_msg:
        new_msg = ''.join(return_msg)
    print(f'Your decoded message is: {new_msg}')




initial_loop = True
while  initial_loop == True:
    step1 = input("Do you want to encode or decode? Please type your response: \n").lower()
    if step1 == "encode":
        initial_loop = False
        message = input("Please type your message: \n").lower()
        position_shift = int(input("Please type encoding number: \n"))
        encode(message = message, position_shift= position_shift)
        second_loop = input("Do you want to continue?, Please type yes or no: \n")
        if second_loop =="yes":
            initial_loop = True
        else:
            print("Have a great day")
        
    elif step1 =="decode":
        initial_loop = False
        message = input("Please type your message: \n").lower()
        position_shift = int(input("Please type encoding number: \n"))
        decode(message = message, position_shift= position_shift)
        second_loop = input("Do you want to continue?, Please type yes or no: \n")
        if second_loop =="yes":
            initial_loop = True
        else:
            print("Have a great day")
    else:
        initial_loop = True
        print("Invalid Response")

