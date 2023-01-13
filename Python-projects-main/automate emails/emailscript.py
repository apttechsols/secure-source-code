from asyncore import read
import datetime as dt
import random 
import smtplib
#setting up condition
now = dt.datetime.now()
day = now.isoweekday()
  #setting up email credential
my_email = 'typeyours@email.com'
password = 'put your password here'

if day == 6:

  

        with open("quotes.txt") as quotes:
            all_quotes = quotes.readlines()
            quote = random.choice(all_quotes)
        
        with open("emails.txt") as emails:
            all_emails = emails.readlines()
            for email in all_emails:
                 #setting up email connection
                with smtplib.SMTP("smtp.gmail.com") as connection:
                    connection.starttls()
                    connection.login(user= my_email, password= password)
                    connection.sendmail(from_addr=my_email, to_addrs= email, msg= f"Subject: Hi, Today Motivational Quote is: \n\n {quote} \n  Hi there, I know you might be wondering what this email is, but this email is setup by Pardeep Singh and this email is an automate message from the server. This email contains a motivational quote and your email have been selected for testing. If you receive this email please reply so that I can get to know if you got it \n Regards, \n Pardeep Singh" )





