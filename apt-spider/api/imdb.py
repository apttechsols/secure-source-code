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
import imdb

@api_view(['GET'])
def get_detail_by_id_v1(request):
    if ( request.GET.get('id')):
        id = request.GET['id']
    else:
        return JsonResponse({'status':0,'data':'Invalid id found','code':400,'ev':1.04}, safe=False)

    try:
        access = imdb.IMDb()
        movie = access.get_movie(id)
        return JsonResponse({'status':1,'data':{'titile':movie['title'],'year':movie['year'],'image':movie['cover url']},'code':200}, safe=False)
    except:
        return JsonResponse({'status':0,'data':'Something went wrong','code':400,'ev':1.04}, safe=False)