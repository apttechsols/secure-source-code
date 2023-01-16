from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.conf import settings
import sys
 


@api_view(['POST','GET'])
def my_platform(request):
    platforms = {
        'linux1' : 'linux',
        'linux2' : 'linux',
        'win32' : 'windows'
    }

    if sys.platform not in platforms:
        current_platform =  sys.platform
    else:
        current_platform = platforms[sys.platform]
    return JsonResponse({'status':1,'data':current_platform,'code':400,'ev':0.01})
