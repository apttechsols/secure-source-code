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
from urllib.parse import urlparse
import wikipedia

@api_view(['POST'])
def wikipedia_search(request):
    if ( request.POST.get('q')):
        query = urllib.parse.quote(request.POST['q'])
    else:
        return JsonResponse({'status':0,'data':'Invalid query found','code':400,'ev':1.04}, safe=False)

    if ( request.POST.get('sentences')):
        sentences_get = int(request.POST['sentences'])
    else:
        sentences_get = 1
    
    if ( request.POST.get('limit')):
        limit = int(request.POST['limit'])
    else:
        limit = 1
    
    results = []

    try:
        try:
            wikipedia_obj = wikipedia.page(query)
            title = wikipedia_obj.title
            url = wikipedia_obj.url
            content = wikipedia_obj.content
            links = wikipedia_obj.links
            wikipedia.set_lang("en")
            summary = wikipedia.summary(query,sentences=sentences_get)
            results.append({'title':title,'url':url,'content':content,'links':links,'summary':summary})
        except wikipedia.exceptions.DisambiguationError as e:
            count = 0
            for article in e.options:
                count = count + 1
                if(count > limit):
                    break
                try:
                    wikipedia_obj = wikipedia.page(article)
                    title = wikipedia_obj.title
                    url = wikipedia_obj.url
                    content = wikipedia_obj.content
                    links = wikipedia_obj.links
                    wikipedia.set_lang("en")
                    summary = wikipedia.summary(article,sentences=sentences_get)
                    results.append({'title':title,'url':url,'content':content,'links':links,'summary':summary})
                except:
                    pass
        return JsonResponse({'status':1,'data':results,'code':200}, safe=False)
    except:
        return JsonResponse({'status':0,'data':'Something went wrong','code':400,'ev':1.05}, safe=False)

@api_view(['POST'])
def wikipedia_search_without_summary(request):
    if ( request.POST.get('q')):
        query = urllib.parse.quote(request.POST['q'])
    else:
        return JsonResponse({'status':0,'data':'Invalid query found','code':400,'ev':1.04}, safe=False)

    if ( request.POST.get('limit')):
        limit = int(request.POST['limit'])
    else:
        limit = 1
    
    results = []

    try:
        try:
            wikipedia_obj = wikipedia.page(query)
            title = wikipedia_obj.title
            url = wikipedia_obj.url
            content = wikipedia_obj.content
            links = wikipedia_obj.links
            results.append({'title':title,'url':url,'content':content,'links':links})
        except wikipedia.exceptions.DisambiguationError as e:
            count = 0
            for article in e.options:
                count = count + 1
                if(count > limit):
                    break
                try:
                    wikipedia_obj = wikipedia.page(article)
                    title = wikipedia_obj.title
                    url = wikipedia_obj.url
                    content = wikipedia_obj.content
                    links = wikipedia_obj.links
                    results.append({'title':title,'url':url,'content':content,'links':links})
                except:
                    pass
        return JsonResponse({'status':1,'data':results,'code':200}, safe=False)
    except:
        return JsonResponse({'status':0,'data':'Something went wrong','code':400,'ev':1.05}, safe=False)

@api_view(['POST'])
def wikipedia_summary(request):
    if ( request.POST.get('q')):
        query = urllib.parse.quote(request.POST['q'])
    else:
        return JsonResponse({'status':0,'data':'Invalid query found','code':400,'ev':1.04}, safe=False)

    if ( request.POST.get('sentences')):
        sentences_get = int(request.POST['sentences'])
    else:
        sentences_get = 1
    
    if ( request.POST.get('limit')):
        limit = int(request.POST['limit'])
    else:
        limit = 1
    
    results = []

    try:
        try:
            wikipedia.set_lang("en")
            summary = wikipedia.summary(query,sentences=sentences_get)
            results.append({'summary':summary})
        except wikipedia.exceptions.DisambiguationError as e:
            count = 0
            for article in e.options:
                count = count + 1
                if(count > limit):
                    break
                try:
                    wikipedia.set_lang("en")
                    summary = wikipedia.summary(article,sentences=sentences_get)
                    results.append({'summary':summary})
                except:
                    pass
        return JsonResponse({'status':1,'data':results,'code':200}, safe=False)
    except:
        return JsonResponse({'status':0,'data':'Something went wrong','code':400,'ev':1.05}, safe=False)