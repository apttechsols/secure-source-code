from system.main import _frontend_and_backend
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.conf import settings
import json
from app import settings
import time
import random
import difflib
from base64 import b64encode
import os
import sys
import urllib
from urllib.parse import urlparse
import string
import mysql.connector
import requests
# Core Pkgs
import streamlit as st 
import altair as alt
import plotly.express as px 

# EDA Pkgs
import pandas as pd 
import numpy as np 
from datetime import datetime

# Utils
import joblib 
import text2emotion as tx2em

import nltk
nltk.download('omw-1.4')

from flair.models import TextClassifier
from flair.data import Sentence

@api_view(['POST'])
def emotions_in_text(request):
    pipe_lr = joblib.load(open(settings.STATIC_ROOT_ORG+"/models/emotion_classifier_pipe_lr_03_june_2021.pkl","rb"))
    if ( request.POST.get('text')):
        article = request.POST['text']
    else:
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.04}, safe=False)
    
    results = pipe_lr.predict([article])
    return JsonResponse({'status':1,'data':{'emotion':results},'code':200}, safe=False)

@api_view(['POST'])
def emotions_in_text_using_text2emotion(request):
    if ( request.POST.get('text')):
        article = request.POST['text']
    else:
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.04}, safe=False)
    
    results = tx2em.get_emotion(article)
    article_emotions = dict()
    article_emotion = "natural"
    article_emotion_ratio = 0.0
    for item in results:
        article_emotions[item] = round(results[item]*100,2)
        if(article_emotion_ratio < round(results[item]*100,2)):
            article_emotion_ratio = round(results[item]*100,2)
            article_emotion = item.lower()

    return JsonResponse({'status':1,'data':{'emotion':article_emotion},'code':200}, safe=False)

@api_view(['POST'])
def sentiment_in_text(request):
    if ( request.POST.get('text')):
        article = request.POST['text']
    else:
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.04}, safe=False)
    sia = TextClassifier.load('en-sentiment')
    sentence = Sentence(article)
    sia.predict(sentence)
    score = sentence.labels[0]
    if "POSITIVE" in str(score):
        result_sentiment = "positive"
    elif "NEGATIVE" in str(score):
        result_sentiment = "negative"
    else:
        result_sentiment = "neutral"
        
    return JsonResponse({'status':1,'data':{'sentiment':result_sentiment},'code':200}, safe=False)


@api_view(['POST'])
def emotion_and_sentiment_in_text_multiple(request):
    if ( request.POST.get('text')):
        article = request.POST['text']
    else:
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.04}, safe=False)
    
    if(len(article) < 1):
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.05}, safe=False)
    
    pipe_lr = joblib.load(open(settings.STATIC_ROOT_ORG+"/models/emotion_classifier_pipe_lr_03_june_2021.pkl","rb"))

    articles = article.split('||::||')
    analysis = []

    for item in articles:
        emotion_analysis = (pipe_lr.predict([item])[0]).lower()
        
        sia = TextClassifier.load('en-sentiment')
        sentence = Sentence(item)
        sia.predict(sentence)
        score = sentence.labels[0]
        if "POSITIVE" in str(score):
            semtiment_analysis = "positive"
        elif "NEGATIVE" in str(score):
            semtiment_analysis = "negative"
        else:
            semtiment_analysis = "neutral"
        
        if(semtiment_analysis == "positive"):
            #all_emotion = ['joy','sadness','fear','anger','surprise','neutral','disgust','sad','happy','shame']
            negative_emotion = ['sadness','fear','anger','disgust','sad','shame']
            if(emotion_analysis in negative_emotion):
                emotion_analysis = "neutral"
        elif(semtiment_analysis == "negative"):
            positive_emotion = ['joy','surprise','happy']
            if(emotion_analysis in positive_emotion):
                emotion_analysis = "neutral"
        
        analysis.append({'article':item,'emotion':emotion_analysis,'semtiment':semtiment_analysis})
    
    return JsonResponse({'status':1,'data':{'analysis':analysis},'code':200}, safe=False)

@api_view(['POST'])
def emotion_in_text_multiple(request):
    if ( request.POST.get('text')):
        article = request.POST['text']
    else:
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.04}, safe=False)
    
    if(len(article) < 1):
        return JsonResponse({'status':0,'data':'Invalid text found','code':400,'ev':1.05}, safe=False)
    
    pipe_lr = joblib.load(open(settings.STATIC_ROOT_ORG+"/models/emotion_classifier_pipe_lr_03_june_2021.pkl","rb"))

    articles = article.split('||::||')
    analysis = []

    for item in articles:
        emotion_analysis = (pipe_lr.predict([item])[0]).lower()
        
        analysis.append({'article':item,'emotion':emotion_analysis})
    
    return JsonResponse({'status':1,'data':{'analysis':analysis},'code':200}, safe=False)