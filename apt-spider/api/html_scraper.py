from system.main import _frontend_and_backend
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.conf import settings
import json
import selenium
#from selenium import webdriver
from seleniumwire import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from app import settings
import time
import random
import difflib
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.common.proxy import *
from base64 import b64encode
import os
import sys
import urllib
from urllib.parse import urlparse
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem,SoftwareEngine,SoftwareType, HardwareType
import string
from selenium.webdriver.common.action_chains import ActionChains
import mysql.connector
import requests

@api_view(['POST'])
def html_scraper(request):
    if ( request.POST.get('url')):
        url = request.POST['url']
    else:
        return JsonResponse({'status':0,'data':'Invalid url found','code':400,'ev':1.04}, safe=False)
    
    # User Agents
    software_names = [SoftwareName.EDGE.value,SoftwareName.FIREFOX.value,SoftwareName.OPERA.value]
    operating_systems = [OperatingSystem.WINDOWS.value, OperatingSystem.LINUX.value]
    software_engines = [SoftwareEngine.GECKO.value,SoftwareEngine.BLINK.value,SoftwareEngine.WEBKIT.value]
    software_types = [SoftwareType.WEB_BROWSER.value]
    hardware_types = [HardwareType.COMPUTER.value]

    user_agent_rotator = UserAgent(software_names=software_names, software_types=software_types, hardware_types=hardware_types, operating_systems=operating_systems, limit=100)
    user_agent = user_agent_rotator.get_random_user_agent()

    profile = webdriver.FirefoxProfile()
    profile.set_preference("general.useragent.override", user_agent)
    
    options = Options()
    options.headless = True

    firefox_capabilities = webdriver.DesiredCapabilities.FIREFOX
    firefox_capabilities['marionette'] = True

    PROXY = "http://geonode_mifreBhjAA:4777f80c-5151-4725-9a5b-83cefb103b21@rotating-residential.geonode.com:9000"

    # firefox_capabilities['proxy'] = {
    #     "proxyType": "MANUAL",
    #     "httpProxy": PROXY,
    #     "sslProxy": PROXY
    # }

    options_wire = {
        'proxy': {
            'http': PROXY,
            'https': PROXY
            }
    }
    
    platforms = {
        'linux1' : 'linux',
        'linux2' : 'linux',
        'win32' : 'windows'
    }

    if sys.platform not in platforms:
        current_platform =  sys.platform
    else:
        current_platform = platforms[sys.platform]

    if(current_platform == 'windows'):
        browser_executable_path = os.path.join(settings.STATIC_ROOT_ORG,'assets/windows/geckodriver.exe')
    elif(current_platform == 'linux'):
        browser_executable_path = os.path.join(settings.STATIC_ROOT_ORG,'assets/linux/geckodriver')
    else:
        error_response = {'status':0,'data':'Something went wrong','code':400,'ev':0.01}
        return JsonResponse(error_response, safe=False)
    
    #driver = webdriver.Firefox(options=options, seleniumwire_options=options_wire, capabilities=firefox_capabilities, executable_path=browser_executable_path)
    try:
        driver = webdriver.Firefox(options=options, seleniumwire_options=options_wire, capabilities=firefox_capabilities, executable_path=browser_executable_path)
    except:
        error_response = {'status':0,'data':'Browser driver can not able initialized','code':400,'ev':0.01}
        return JsonResponse(error_response, safe=False)
    driver.get(url)
    page_source = driver.page_source
    driver.close()
    return JsonResponse({'status':0,'data':page_source,'code':200}, safe=False)

@api_view(['POST'])
def html_scraper_v2(request):
    if ( request.POST.get('url')):
        url = request.POST['url']
    else:
        return JsonResponse({'status':0,'data':'Invalid url found','code':400,'ev':1.04}, safe=False)
    proxies = {
        "http": "http://geonode_mifreBhjAA:4777f80c-5151-4725-9a5b-83cefb103b21@rotating-residential.geonode.com:9000",
        "https": "http://geonode_mifreBhjAA:4777f80c-5151-4725-9a5b-83cefb103b21@rotating-residential.geonode.com:9000",
    }
    r = requests.request('GET', url, proxies=proxies, timeout=30)
    return JsonResponse(r.text, safe=False)
