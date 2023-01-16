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
from newspaper import Article
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize 
import nltk
from nltk.corpus import stopwords 
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.download('punkt')
nltk.download('stopwords')

import joblib
nltk.download('omw-1.4')

from flair.models import TextClassifier
from flair.data import Sentence
import pytz
from urllib.parse import urlparse

@api_view(['POST'])
def article_scraper(request):
    if ( request.POST.get('url')):
        url = request.POST['url']
    else:
        return JsonResponse({'status':0,'data':'Invalid url found','code':400,'ev':1.04}, safe=False)

    try:
        article = Article(url)
        article.download()
        article.parse()
        article.nlp()
    except:
        return JsonResponse({'status':0,'data':'Something went wrong','code':400,'ev':1.04}, safe=False)

    try:
        article_thumbnail = article.top_image
        if(article_thumbnail == None):
            article_thumbnail = ""
    except:
        article_thumbnail = ""
    
    try:
        full_article = article.text
        if(full_article == None or len(full_article) < 40):
            full_article = ""
    except:
        full_article = ""
    
    try:
        article_title = article.title
        if(article_title == None):
            article_title = ""
    except:
        article_title = ""
    
    try:
        article_keywords = article.keywords
        if(article_keywords == None):
            article_keywords = ""
    except:
        article_keywords = ""
    
    try:
        article_publish_date = article.publish_date
        if(article_publish_date == None):
            article_publish_date = ""
    except:
        article_publish_date = ""
    
    if(len(full_article) > 0):
        try:
            # Tokenizing the text 
            nltk_stopWords = set(stopwords.words("english")) 
            nltk_words = word_tokenize(full_article) 
                
            # Creating a frequency table to keep the  
            # score of each word 
                
            nltk_freqTable = dict() 
            for nltk_word in nltk_words: 
                nltk_word = nltk_word.lower() 
                if nltk_word in nltk_stopWords: 
                    continue
                if nltk_word in nltk_freqTable: 
                    nltk_freqTable[nltk_word] += 1
                else: 
                    nltk_freqTable[nltk_word] = 1
                
            # Creating a dictionary to keep the score 
            # of each sentence 
            nltk_sentences = sent_tokenize(article.text) 
            nltk_sentenceValue = dict() 
                
            for nltk_sentence in nltk_sentences: 
                for nltk_word, nltk_freq in nltk_freqTable.items(): 
                    if nltk_word in nltk_sentence.lower(): 
                        if nltk_sentence in nltk_sentenceValue: 
                            nltk_sentenceValue[nltk_sentence] += nltk_freq 
                        else: 
                            nltk_sentenceValue[nltk_sentence] = nltk_freq 
                
                
                
            nltk_sumValues = 0
            for nltk_sentence in nltk_sentenceValue: 
                nltk_sumValues += nltk_sentenceValue[nltk_sentence] 
                
            # Average value of a sentence from the original text
                
            nltk_average = int(nltk_sumValues / len(nltk_sentenceValue)) 
                
            # Storing sentences into our summary. 
            article_summary = '' 
            for nltk_sentence in nltk_sentences: 
                if (nltk_sentence in nltk_sentenceValue) and (nltk_sentenceValue[nltk_sentence] > (1.2 * nltk_average)): 
                    article_summary += " " + nltk_sentence
        except:
            article_summary = ""
        if(len(article_summary) < 20):
            article_summary = ""
    else:
        article_summary = ""

    return JsonResponse({'status':1,'data':{'article_title':article_title,'full_article':full_article,'article_thumbnail':article_thumbnail,'article_keywords':article_keywords,'article_publish_date':article_publish_date,'article_summary':article_summary},'code':200}, safe=False)

@api_view(['POST'])
def article_scraper_with_emotion_and_sentiment_analysis(request):
    pipe_lr = joblib.load(open(settings.STATIC_ROOT_ORG+"/models/emotion_classifier_pipe_lr_03_june_2021.pkl","rb"))
    if ( request.POST.get('url')):
        url = request.POST['url']
    else:
        return JsonResponse({'status':0,'data':'Invalid url found','code':400,'ev':1.041}, safe=False)
    
    parsed_url = urlparse(url)
    url_scheme = '{uri.scheme}'.format(uri=parsed_url)
    url_netloc = '{uri.netloc}'.format(uri=parsed_url)

    loop = 1
    max_allowed_loop = 2
    article_thumbnail_url_scheme = ""
    while (loop <= max_allowed_loop):
        loop = loop + 1
        try:
            article = Article(url)
            article.download()
            article.parse()
            article.nlp()
        except:
            return JsonResponse({'status':0,'data':'Something went wrong','code':400,'url':url,'ev':1.042}, safe=False)

        try:
            article_thumbnail = article.top_image
            if(article_thumbnail == None):
                article_thumbnail = ""
            else:
                article_thumbnail_url_netloc_changed = 0
                article_thumbnail_parsed_url = urlparse(article_thumbnail)
                article_thumbnail_url_netloc = ('{uri.netloc}'.format(uri=article_thumbnail_parsed_url)).lower()
                article_thumbnail_url_scheme = ('{uri.scheme}'.format(uri=article_thumbnail_parsed_url)).lower()
                if(article_thumbnail_url_netloc == "localhost" ):
                    article_thumbnail = article_thumbnail.replace("localhost", url_netloc,1)
                    article_thumbnail_url_netloc_changed = 1
                elif(article_thumbnail_url_netloc == "127.0. 0.1"):
                    article_thumbnail = article_thumbnail.replace("127.0. 0.1", url_netloc,1)
                    article_thumbnail_url_netloc_changed = 1
                elif 'localhost:' in article_thumbnail_url_netloc:
                    article_thumbnail = article_thumbnail.replace(article_thumbnail_url_netloc, url_netloc,1)
                    article_thumbnail_url_netloc_changed = 1
                elif '127.0. 0.1:' in article_thumbnail_url_netloc:
                    article_thumbnail = article_thumbnail.replace(article_thumbnail_url_netloc, url_netloc,1)
                    article_thumbnail_url_netloc_changed = 1
                
                if(article_thumbnail_url_netloc_changed == 1):
                    article_thumbnail = article_thumbnail.replace(article_thumbnail_url_scheme, url_scheme,1)

        except:
            article_thumbnail = ""
        
        try:
            full_article = article.text
            if(full_article == None or len(full_article) < 40):
                full_article = ""
        except:
            full_article = ""
        
        try:
            article_title = article.title
            if(article_title == None):
                article_title = ""
        except:
            article_title = ""
        
        try:
            article_keywords = article.keywords
            if(article_keywords == None):
                article_keywords = ""
        except:
            article_keywords = ""
        
        try:
            article_publish_date = article.publish_date
            if(article_publish_date == None):
                article_publish_date = ""
            else:
                article_publish_date = article_publish_date.astimezone(pytz.UTC)
        except:
            article_publish_date = ""
        
        if(len(full_article) > 0):
            try:
                # Tokenizing the text 
                nltk_stopWords = set(stopwords.words("english")) 
                nltk_words = word_tokenize(full_article) 
                    
                # Creating a frequency table to keep the  
                # score of each word 
                    
                nltk_freqTable = dict() 
                for nltk_word in nltk_words: 
                    nltk_word = nltk_word.lower() 
                    if nltk_word in nltk_stopWords: 
                        continue
                    if nltk_word in nltk_freqTable: 
                        nltk_freqTable[nltk_word] += 1
                    else: 
                        nltk_freqTable[nltk_word] = 1
                    
                # Creating a dictionary to keep the score 
                # of each sentence 
                nltk_sentences = sent_tokenize(article.text) 
                nltk_sentenceValue = dict() 
                    
                for nltk_sentence in nltk_sentences: 
                    for nltk_word, nltk_freq in nltk_freqTable.items(): 
                        if nltk_word in nltk_sentence.lower(): 
                            if nltk_sentence in nltk_sentenceValue: 
                                nltk_sentenceValue[nltk_sentence] += nltk_freq 
                            else: 
                                nltk_sentenceValue[nltk_sentence] = nltk_freq 
                    
                    
                    
                nltk_sumValues = 0
                for nltk_sentence in nltk_sentenceValue: 
                    nltk_sumValues += nltk_sentenceValue[nltk_sentence] 
                    
                # Average value of a sentence from the original text
                    
                nltk_average = int(nltk_sumValues / len(nltk_sentenceValue)) 
                    
                # Storing sentences into our summary. 
                article_summary = '' 
                for nltk_sentence in nltk_sentences: 
                    if (nltk_sentence in nltk_sentenceValue) and (nltk_sentenceValue[nltk_sentence] > (1.2 * nltk_average)): 
                        article_summary += " " + nltk_sentence
            except:
                article_summary = ""
            if(len(article_summary) < 20):
                article_summary = ""
        else:
            article_summary = ""
        
        if(len(full_article) > 50):
            emotion_analysis = (pipe_lr.predict([full_article])[0]).lower()
        else:
            emotion_analysis = "undefined"
        
        if(article_title == ""):
            if(loop <= max_allowed_loop):
                if(url_scheme == 'http'):
                    url = url.replace("http://", 'https://')
                    url_scheme = 'https'
                    continue
                elif(url_scheme == 'https'):
                    url = url.replace("https://", 'http://')
                    url_scheme = 'http'
                    continue
            return JsonResponse({'status':0,'data':'Something went wrong','code':404,'url':url,'ev':1.0424}, safe=False)
        
        if(len(full_article) > 50):
            sia = TextClassifier.load('en-sentiment')
            sentence = Sentence(full_article)
            sia.predict(sentence)
            score = sentence.labels[0]
            if "POSITIVE" in str(score):
                semtiment_analysis = "positive"
            elif "NEGATIVE" in str(score):
                semtiment_analysis = "negative"
            else:
                semtiment_analysis = "neutral"
        else:
            semtiment_analysis = "undefined"
        
        if(semtiment_analysis == "positive"):
            #all_emotion = ['joy','sadness','fear','anger','surprise','neutral','disgust','sad','happy','shame']
            negative_emotion = ['sadness','fear','anger','disgust','sad','shame']
            if(emotion_analysis in negative_emotion):
                emotion_analysis = "neutral"
        elif(semtiment_analysis == "negative"):
            positive_emotion = ['joy','surprise','happy']
            if(emotion_analysis in positive_emotion):
                emotion_analysis = "neutral"

    return JsonResponse({'status':1,'data':{'article_title':article_title,'full_article':full_article,'article_thumbnail':article_thumbnail,'article_keywords':article_keywords,'article_publish_date':article_publish_date,'article_summary':article_summary,'article_emotion':emotion_analysis,'article_sentiment':semtiment_analysis},'code':200}, safe=False)
