#!/usr/bin/python3

import tkinter as tk
import cv2
import os
import csv
import numpy as np
from PIL import Image
import face_recognition
import webbrowser as wb
from tkinter import messagebox

window = tk.Tk()
window.geometry('1920x1080')
window.title("STUDENTS PORTAL")
window.configure(background='dark green')
window.grid_rowconfigure(0, weight=1)
window.grid_columnconfigure(0, weight=1)

x_cord = 75
y_cord = 20
checker = 0

message = tk.Label(window, text="RED TEAM HACKER ACADEMY", bg="white", fg="black", width=57, height=2,
                   font=('Serif', 25, 'bold'))
message.place(x=200, y=20)
message = tk.Label(window, text="ADCD STUDENT MANAGEMENT PORTAL", bg="white", fg="black", width=57, height=2,
                   font=('Serif', 25, 'bold'))
message.place(x=200, y=80)
lbl = tk.Label(window, text="ENROLL ID", width=20, height=1, fg="white", bg="dark green",
               font=('Serif', 20, ' bold '))
lbl.place(x=220 - x_cord, y=355 - y_cord)
txt = tk.Entry(window, width=40, bg="white", fg="black", font=('Serif', 10, ' bold '))
txt.place(x=550 - x_cord, y=365 - y_cord)
lbl2 = tk.Label(window, text="FULL NAME", width=20, fg="white", bg="dark green", height=2,
                font=('Serif', 20, ' bold '))
lbl2.place(x=225 - x_cord, y=395 - y_cord)
txt1 = tk.Entry(window, width=40, bg="white", fg="black", font=('Serif', 10, ' bold '))
txt1.place(x=550 - x_cord, y=410 - y_cord)
lbl3 = tk.Label(window, text="CONTACT NO", width=20, height=1, fg="white", bg="dark green",
                font=('Serif', 19, ' bold '))
lbl3.place(x=240 - x_cord, y=460 - y_cord)
txt2 = tk.Entry(window, width=40, bg="white", fg="black", font=('Serif', 10, ' bold '))
txt2.place(x=550 - x_cord, y=460 - y_cord)
lbl4 = tk.Label(window, text="RESPONCE", width=20, fg="white", bg="dark green", height=2,
                font=('Serif', 20, ' bold '))
lbl4.place(x=220 - x_cord, y=490 - y_cord)
message = tk.Label(window, text="", bg="white", fg="black", width=40, height=4, activebackground="white",
                   font=('Serif', 10, ' bold '))
message.place(x=550 - x_cord, y=515 - y_cord)

message1 = tk.Label(window, text="NOTICE ", width=20, height=1, fg="white", bg="dark green",
                    font=('Serif', 20, ' bold '))
message1.place(x=910 - x_cord, y=405 - y_cord)
message2 = tk.Label(window, text="Please click the VERIFY \nfor verifying the student for joining the meet", fg="red",
                    bg="white", activeforeground="dark green", width=40, height=3,
                    font=('Serif', 10, ' bold '))
message2.place(x=1145, y=410 - y_cord)

lbl = tk.Label(window, text="STUDENT", width=20, height=1, fg="white", bg="dark green",
               font=('Serif', 20, ' bold '))
lbl.place(x=915 - x_cord, y=355 - y_cord)

txt3 = tk.Label(window, width=40, bg="white", fg="black", font=('Serif', 10, ' bold '))
txt3.place(x=1220 - x_cord, y=365 - y_cord)


def clear1():
    txt.delete(0, 'end')
    res = ""
    message.configure(text=res)


def clear2():
    txt1.delete(0, 'end')
    res = ""
    message.configure(text=res)


def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        pass

    try:
        import unicodedata
        unicodedata.numeric(s)
        return True
    except (TypeError, ValueError):
        pass

    return False


def TakeImages():
    Id = (txt.get())
    name = (txt1.get())
    contact = (txt2.get())
    if not Id:
        res = "Please enter Id"
        message.configure(text=res)

    elif not name:
        res = "Please enter your Name"
        message.configure(text=res)

    elif not contact:
        res = "Please enter your contact number"
        message.configure(text=res)

    elif is_number(Id) and name.isalpha() and is_number(contact):
        cam = cv2.VideoCapture(0)
        harcascadePath = "haarcascade_frontalface_default.xml"
        detector = cv2.CascadeClassifier(harcascadePath)
        sampleNum = 0
        while True:
            ret, img = cam.read()
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = detector.detectMultiScale(gray, 1.3, 5)
            for (x, y, w, h) in faces:
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 2)
                # incrementing sample number
                sampleNum = sampleNum + 1
                # saving the captured face in the dataset folder TrainingImage
                cv2.imwrite("ImageProof/ " + name + ".jpg", img[y:y + h, x:x + w])
                # display the frame
                cv2.imshow('frame', img)
            if cv2.waitKey(100) & 0xFF == ord('q'):
                break
            # break if the sample number is morethan 100
            elif sampleNum > 100:
                break
        cam.release()
        cv2.destroyAllWindows()
        res = "Images Saved for \n ID : " + Id + "\n Name : " + name + "\n contact : " + contact
        row = [Id, name, contact]
        with open('Details/Details.csv', 'a+') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow(row)
        csvFile.close()
        message.configure(text=res)
    else:
        if is_number(name):
            res = "Enter Alphabetical Name"
            message.configure(text=res)
        if Id.isalpha():
            res = "Enter Numeric Id(enroll)"
            message.configure(text=res)
        if contact.isalpha():
            res = "Enter Numeric Id(contact)"
            message.configure(text=res)


def getImagesAndLabels(path):
    imagePaths = [os.path.join(path, f) for f in os.listdir(path)]

    faces = []

    Ids = []

    for imagePath in imagePaths:
        # loading the image and converting it to gray scale
        pilImage = Image.open(imagePath).convert('L')
        # Now we are converting the PIL image into numpy array
        imageNp = np.array(pilImage, 'uint8')
        # getting the Id from the image
        #        Id = int(os.path.split(imagePath)[-1].split(".")[1])
        # extract the face from the training image sample
        faces.append(imageNp)
    return faces, Ids


def get_encoded_faces():
    encoded = {}

    for dirpath, dnames, fnames in os.walk("/root/PycharmProjects/art/ImageProof/"):
        for f in fnames:
            if f.endswith(".jpg") or f.endswith(".png"):
                face = face_recognition.load_image_file("ImageProof/" + f)
                encoding = face_recognition.face_encodings(face)[0]
                encoded[f.split(".")[0]] = encoding

    return encoded


def unknown_image_encoded(img):
    face = face_recognition.load_image_file("ImageProof/" + img)
    encoding = face_recognition.face_encodings(face)[0]
    return encoding


def TrackImages():
    faces = get_encoded_faces()
    faces_encoded = list(faces.values())
    known_face_names = list(faces.keys())
    im = cv2.VideoCapture(0)
    ret, img = im.read(1)
    face_locations = face_recognition.face_locations(img)
    unknown_face_encodings = face_recognition.face_encodings(img, face_locations)
    face_names = []
    for face_encoding in unknown_face_encodings:
        matches = face_recognition.compare_faces(faces_encoded, face_encoding)
        face_distances = face_recognition.face_distance(faces_encoded, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            face_names.append(known_face_names[best_match_index])

            txt3.configure(text=face_names)
            wb.get('firefox %s').open_new_tab('https://www.google.com')

        else:
            message.configure(text="Student not Verified")
            message2.configure(text="You are not eligible for getting the meet link")

    cv2.waitKey(1)
    im.release()

    cv2.destroyAllWindows()


def quit_window():
    MsgBox = tk.messagebox.askquestion('Exit Application', 'Are you sure ? You want to exit the application',
                                       icon='warning')
    if MsgBox == 'yes':
        tk.messagebox.showinfo("Greetings", "Thank You for your visit. Have a nice day ahead!!")
        window.destroy()


takeImg = tk.Button(window, text="IMAGE PROOF", command=TakeImages, fg="white", bg="black", width=25, height=2,
                    activebackground="dark green", font=('Serif', 15, ' bold '))
takeImg.place(x=400 - x_cord, y=250 - y_cord)
trackImg = tk.Button(window, text="VERIFY", command=TrackImages, fg="white", bg="black", width=25,
                     height=2, activebackground="dark green", font=('Serif', 15, ' bold '))
trackImg.place(x=1075 - x_cord, y=250 - y_cord)
quitWindow = tk.Button(window, text="EXIT", command=quit_window, fg="white", bg="red", width=10, height=2,
                       activebackground="pink", font=('Serif', 15, ' bold '))
quitWindow.place(x=1550, y=115 - y_cord)

window.mainloop()
