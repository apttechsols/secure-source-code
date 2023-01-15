from datetime import date


today = date.today()

ingredients = [{'water':'1000ml',
                'milk':'1000ml',
                'coffee':'100g',
                'money':'$0'
                }]
sales =[]

user_input = input(''' 
What would you like to have today?, Please press :\n
1 for Espresso\n
2 for Latte\n
3 for Cappuccino\n
''')

def loop():
    global user_input
    user_input = input(''' 
    What would you like to have today?, Please press :\n
    1 for Espresso\n
    2 for Latte\n
    3 for Cappuccino\n
    ''')
    return


def check_ingredients(data):
    global is_machine_off
    # converting data for calculations
    coffee = int(ingredients[0]['coffee'].replace('g',''))
    water = int(ingredients[0]['water'].replace('ml',''))
    milk = int(ingredients[0]['milk'].replace('ml',''))
    money = float(ingredients[0]['money'].replace('$',''))

    # checking if everything is enough
    if coffee < 0:
        print("Insufficent Coffee, Please fill coffee\n")
        return True
    elif water < 0:
        print("Insufficent Water, Please fill water\n")
        return True
    elif milk < 0:
        print("Insufficent Milk, Please fill milk\n")
        return True
    
    return 




def change(price):
    dime = int(input("How many Dimes?\n"))
    quarter = int(input("How many quarters?\n"))
    dollar = int(input("How many $1?\n"))
    dollar2 = int(input("How many $2?\n"))
    dimes = float(dime * 0.10)
    quarters = float(quarter * 0.25)
    dollars = float(dollar * 1)
    dollars2 = float(dollar2 * 2)

    
    total = dimes + quarter + dollars + dollars2
    

    if total >price:
        total -= price
        total = '{:.2f}'.format(total)
        print(f"Your change is {total}, Please collect your change")
    elif total <price:
        print("Insufficent Amount, Please collect your coins, Money Refunded")

    
    return total


def report():
    print(ingredients)
    return

def sales_report():
    print(sales)
    print("Sales report Succesfully printed!!")
    return

def espresso():
    global ingredients
    global sales
    price = 2.50
   
    #converting strings to integers to perform calculations
    coffee = int(ingredients[0]['coffee'].replace('g',''))
    water = int(ingredients[0]['water'].replace('ml',''))
    milk = ingredients[0]['milk']
    money = float(ingredients[0]['money'].replace('$',''))
    # performing calculations
    coffee -= 18
    water -= 60
    money += price
    # converting to strings again to update ingredients
    coffee = str(coffee)+'g'
    water = str(water)+'ml'
    money = '$'+str(money)

    ingredients = [{
        'water':water,
        'milk': milk,
        'coffee': coffee,
        'money': money
    }]
    sales_data = {'date':today,
              'drink':'Espresso',
              'price': price
    
    }
    sales.append(sales_data)
    change(price)
    print("Your Espresso is ready, Enjoy\n")
    return price

    

def latte():
    global ingredients
    global sales
    price = 4.50
    #converting strings to integers to perform calculations
    coffee = int(ingredients[0]['coffee'].replace('g',''))
    water = int(ingredients[0]['water'].replace('ml',''))
    milk = int(ingredients[0]['milk'].replace('ml',''))
    money = float(ingredients[0]['money'].replace('$',''))
    # performing calculations
    coffee -= 15
    water -= 100
    milk -= 150
    money += price
    # converting to strings again to update ingredients
    coffee = str(coffee)+'g'
    water = str(water)+'ml'
    money = '$'+str(money)
    milk = str(milk)+'ml'

    ingredients = [{
        'water':water,
        'milk': milk,
        'coffee': coffee,
        'money': money
    }]
    sales_data = {'date':today,
              'drink':'Latte',
              'price': price
    
    }
    sales.append(sales_data)
    change(price)
    print("Your Latte is ready, Enjoy\n")
    return price


def cappucino():
    global ingredients
    global sales
    price = 4.50
    #converting strings to integers to perform calculations
    coffee = int(ingredients[0]['coffee'].replace('g',''))
    water = int(ingredients[0]['water'].replace('ml',''))
    milk = int(ingredients[0]['milk'].replace('ml',''))
    money = float(ingredients[0]['money'].replace('$',''))
    # performing calculations
    coffee -= 18
    water -= 50
    milk -= 200
    money += price
    # converting to strings again to update ingredients
    coffee = str(coffee)+'g'
    water = str(water)+'ml'
    money = '$'+str(money)
    milk = str(milk)+'ml'

    ingredients = [{
        'water':water,
        'milk': milk,
        'coffee': coffee,
        'money': money
    }]
    sales_data = {'date':today,
              'drink':'Cappucino',
              'price': price
    
    }
    sales.append(sales_data)
    change(price)
    print("Your Cappucino is ready, Enjoy\n")
    return price


def shutdown():
    print(''' 
    Please wait\n
    Machine has been Shut Down \n
    See you next time!!!
    ''')
    return

def reload():
    global ingredients
    global sales
    # Updating strings again to update ingredients
    coffee = '100g'
    water = '1000ml'
    money = '$0'
    milk = '1000ml'

    ingredients = [{
        'water':water,
        'milk': milk,
        'coffee': coffee,
        'money': money
    }]
    print("Machine Reload, Success!!\n New available cash is $0")
    return ingredients

is_machine_off = False
while not is_machine_off:
    if user_input =='1':
        test = check_ingredients(ingredients)
        if test == True:
            print("Machine Unavailable")
            is_machine_off = True

        else:
            espresso()
            loop()
    elif user_input =='2':
        test = check_ingredients(ingredients)
        if test == True:
            print("Machine Unavailable")
            is_machine_off = True
        else:
            latte()
            loop()
    elif user_input =='3':
        test = check_ingredients(ingredients)
        if test == True:
            print("Machine Unavailable")
            is_machine_off = True
        else:
            cappucino()
            loop()
    elif user_input =='reload':
        reload()
        loop()
    elif user_input =='shut down':
        is_machine_off = True
        shutdown()
    elif user_input =='report':
        report()
        loop()
    elif user_input =='sales report':
        sales_report()
        loop()
    else:
        is_machine_off = True
        print("Invalid response, Please try again")
        loop()
