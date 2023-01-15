# cv2 لاستدعاء الصور في بايثون بمكتبة 

import cv2 
'''
img = cv2.imread('images/car.jpg') #لاستدعاء الصورة 
#print(img) #لطباعة الابعاد الصورة في مصفوفة

cv2.imshow('Mohammed', img)#لعرض الصورة في نافذه 
cv2.waitKey(0)# امر انتظار النافذه في العرض لعرض الصور نستخدم الصفر لانها ثابته

#cv2.waitKey(1)  #ملاحظة اذا كان الذي تريد عرضه فديو  نكتب  الرقم 1 

'''

#عرض ابعاد الصورة والبكسلات  imginfo
'''

img = cv2.imread('images/car.jpg')
pixels = img.size # يقوم باعطى البكسلات هنا
dimesions = img.shape # يقوم باعطى الابعاد الصورة
cv2.imshow('@__', img)
print("number of pixels : ", pixels)# طباعة لبكسلات للصورة
print("dimesions : ", dimesions)# طباعة الابعاد الصورة 
cv2.waitKey(0)

'''

# تغيير حجم الصورة والنافذة 
'''
img = cv2.imread('images/car.jpg')
new_img = cv2.resize(img, (300 , 200)) # تغيير العرض والارتفاع 
cv2.imshow('size img', new_img)
cv2.waitKey(0)
'''

#نظام الالون في المكتبة 
'''
img = cv2.imread('images/car.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) # لتحويل الالون للصورة
cv2.imshow('__img__', gray)
cv2.waitKey(0)
'''
# فتح الصورة عرض الصورة نخصص زر لاغلاق البرنامج وزر نحفظ الصورة
'''
img = cv2.imread('images/tra.jpg')
cv2.imshow('__img__', img)
k = cv2.waitKey(0)

if k == 27:
    cv2.destroyAllWindows() # لاغلاق النافذه بالضغط على ESC
elif k == ord('s'): # اذا قمت بالضغط على زر اس  يقوم بحفظ الصورة في المسار
    cv2.imwrite('C:/Users/Mohamed/Desktop/tea.jpg', img)
    cv2.destroyAllWindows() # بعد الضغط على الزر قم بل اغلاق
'''
# لعرض الفديوهات في البرنامج
'''
cam = cv2.VideoCapture('videos/Car.mp4') #عند استدعاء الفيديوه 
while True: # عبارة عن حلقة تكرار 
    ret , frame = cam.read() #تعريف المتغيرات من اجل قرءة الفيديوه 
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY) #لتحويل الون من لون الفيديوه الى لون اخر 
    size = cv2.resize(frame, (450,300)) # لتغيير حجم الفيديوه 
    cv2.imshow('__video__', size) # لعرض النافذه البرنامج 
    if cv2.waitKey(1) & 0xff == ord('q'): # شرط لاغلق النافذه
        break 
'''

# فتح الكاميرا والتحكم بحجم الكاميرا

camera = cv2.VideoCapture(0)
while True:
    ret , video = camera.read()
    new_cam = cv2.resize(video,(300,200))
    cv2.imshow('show_camera', video)
    if cv2.waitKey(1) & 0xff == ord('q'):
        break









