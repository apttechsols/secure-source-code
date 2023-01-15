#!/usr/bin/env python
# -*- coding: utf-8 -*-

from time import time
from bs4 import BeautifulSoup
from bs4.element import Comment
import urllib.request
import base58
import sys
import glob
import json
import re

# Important: Maybe a X possible useful links found show them all
# Important: Maybe just a found keyterm X times on this page instead of the percent thing

# Find all Links Relating to a HTML Page
def extractLinks(htmlData):
	
	foundLinks = []
	soupData = BeautifulSoup(htmlData, 'html.parser')

	for foudnLink in soupData.findAll('a', attrs={'href': re.compile("^http://")}):
		foundLinks.append(foudnLink.get('href'))

	return foundLinks

# All raw text in a html page extracted, working
# Source Inspiration: https://stackoverflow.com/a/1983219/6460641
def extractText(htmlData):
	
	def tagVisible(element):
	    
	    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
	    
	        return False
	    
	    if isinstance(element, Comment):
	    
	        return False
	    
	    return True


	foundWords = []
	soupData = BeautifulSoup(htmlData, 'html.parser')

	foundText = soupData.findAll(text=True)
	visibleTexts = filter(tagVisible, foundText) 

	unicodeStringTexts = u" ".join(t.strip() for t in visibleTexts)
	unicodeStringTexts = unicodeStringTexts.split()

	return unicodeStringTexts


# Search all files for a keyterm, returns most relevant link(s) and the percentage of keyterms that file holds compared to total
def searchQuery(query):

	# Getting all files
	allFiles = glob.glob("cache/*.txt")

	searchData = [0, 0, []] # Total References, References in Link, Link(s)

	# Iterate through files to search & process
	for processingFile in allFiles:

		# Read file contents to look at stored words
		with open(processingFile) as file:

			# Amount of times the Query is found in the currently processing file
			tempQueryInstanceCount = 0

			# Getting file data words and splitting into array
			fileData = file.read()
			fileData = fileData.split() # Breaks all works into an array

			for word in fileData:

				# Check if it matches query
				if word == query:
					tempQueryInstanceCount += 1

		# If the amount of times the query is found is equal to the currently running total, there will multiple links given
		if tempQueryInstanceCount == searchData[1]:
			searchData[2].append( processingFile.split('/')[1][:-4] )
			searchData[1] = tempQueryInstanceCount

		# New best link
		elif tempQueryInstanceCount > searchData[1]:
			searchData[2] = [ processingFile.split('/')[1][:-4] ]
			searchData[1] = tempQueryInstanceCount

		# Collective amount of times keyword is found
		searchData[0] += tempQueryInstanceCount

	if (searchData[2] != []):

		# Valid Search Query Returned
		return searchData[2]

	else:

		# Nothing Valid Returned
		return None

# Used for time elapsed
startTime = time()
processedLinkCountSession = 0
_oldTimeDiff = 0
_sessionDataUsage = 0

# Start by noting already saved links & links to do
with open("json/links.json") as linksDataFile:

	linksToProcess, processedLinks = [], []

	fileJsonData = json.loads(linksDataFile.read())

	for link in fileJsonData["todo"].items():

		linksToProcess.append(link[1])

	for deadLink in fileJsonData["processed"].items():

		processedLinks.append(deadLink[1])

# Load in stats
with open("json/stats.json") as statsDataFile:
	savedStats = json.loads(statsDataFile.read())

while (True):

	try:
		timeDiff = time() - startTime # Time difference since start and now
		print("Processing Links, Time Elapsed %4dh %2dm %2ds, and %5d links processed in session" % (timeDiff // 3600, (timeDiff - ((timeDiff // 3600) * 3600)) // 60, timeDiff - ((timeDiff // 60) * 60), processedLinkCountSession), end="\r")

		# Process the link
		if (linksToProcess != []):

			linksWorkingLink = linksToProcess[0]

			while True:
				try:
					webRequest = urllib.request.urlopen(linksWorkingLink).read()
					siteHtmlData = webRequest.decode("utf-8")
					savedStats["data"] += len(siteHtmlData) # Collective Data Usage
					_sessionDataUsage += len(siteHtmlData) # Session Data Usage
					break
				
				except urllib.error.HTTPError:
					# General Error with the Page
					linksToProcess.pop(0)
					processedLinks.append(linksWorkingLink)
					linksWorkingLink = linksToProcess[0]
				
				except urllib.error.URLError:
					# Connection Error or Invalid SSL Certificate

					try:

						urllib.request.urlopen("https://google.com/")
						
						linksToProcess.pop(0)
						processedLinks.append(linksWorkingLink)
						linksWorkingLink = linksToProcess[0]

					except urllib.error.URLError:
						print("\nConnection Error, Exiting...")
						sys.exit(1)

				except Exception:
					# Unknown Exception, happens when the page is more of say pure binary data or something
					linksToProcess.pop(0)
					processedLinks.append(linksWorkingLink)
					linksWorkingLink = linksToProcess[0]

			foundKeywords = extractText(siteHtmlData)
			foundLinks = extractLinks(siteHtmlData)

			#del linksToProcess[:0] # Delete the link that has just been processed from links to process
			linksToProcess.pop(0)
			processedLinks.append(linksWorkingLink)

			if (foundKeywords != []):

				try:
					with open("cache/" + base58.b58encode(linksWorkingLink).decode("utf-8") + ".txt" ,"w") as fileCacheSave:
						# Base58 Encode String So Alphanumerical Can Save Full URL as File Name
						fileCacheSave.write((' ').join(foundKeywords))
				except Exception:
					pass
					# Few Possible Errors
					# - Weird binary page data that can cause problems
					# - It's a really long URL that when encoded is too long for this filesystem

			if (foundLinks != []):

				# Update All Links Storage

				for link in foundLinks:

					linksToProcess.append(link)

			# Now Both Links to Process & Processed Links are up to date in the program, now to save in the file
			newSaveData = {"todo": {}, "processed": {}}

			# Preparing New Stats Data
			savedStats["processed"] += 1 # Total processed count
			savedStats["time"] += (time() - startTime) - _oldTimeDiff
			_oldTimeDiff = time() - startTime

			for i in range(len(linksToProcess)):
				newSaveData["todo"][str(i)] = linksToProcess[i]

			for i in range(len(processedLinks)):
				newSaveData["processed"][str(i)] = processedLinks[i]

			with open("json/links.json", "w") as file:
				file.write(json.dumps(newSaveData, indent=4, sort_keys=True)) # The Other Stuff Is Just To Keep It Neat In The Files

			with open("json/stats.json", "w") as file:
				file.write(json.dumps(savedStats, indent=4, sort_keys=True)) # Update Stats

			processedLinkCountSession += 1 # Session processed count


		else:

			# All links to process, processed just end until something new can be added
			print("\nAll Links Have Been Processed\nExiting...")
			sys.exit(0)


	except KeyboardInterrupt:
		
		while (True):
			# Add non break space line here
			print("\nOptions\n - Resume (r)\n - Search (s)\n - Statistics (st)\n - Exit (e).")
			userSelect = input("Select Option: ").lower()

			if (userSelect == "r" or userSelect == "resume"):
				
				# User wants to get back to processing links
				break

			elif (userSelect == "s" or userSelect == "search"):
				
				# Use search query
				query = input("Query: ").lower()
				result = searchQuery(query)

				if result is not None:
					
					if (len(result) > 1):
						print("The following links are equally relevant:")

						for link in result:
							print("    - " + base58.b58decode(link).decode("utf-8"))

					else:
						print("Move relevant link: " + base58.b58decode(result[0]).decode("utf-8") )

				else:
					print("No Relevant Links Found.")

				break

			elif (userSelect == "st" or userSelect == "statistics"):
				
				# Requested stats info
				# \nCollectively: %sh %sm %ss\nEstimated Data Usage: %smb\nTotal Links Processed: %s

				timeDiff = time() - startTime
				print("Time Spent In Session: {0}h {1}m {2}s\nCollectively {3}h {4}m {5}s\nSesssion Estimated Data Usage: {6}mb\nTotal Estimated Data Usage: {7}mb\nLinks Processed In Session: {8}\nLinks Processed in Total: {9}\n".format(int(timeDiff // 3600), int((timeDiff - ((timeDiff // 3600) * 3600)) // 60), int(timeDiff - (timeDiff // 60) * 60), int(savedStats["time"] // 3600), int((savedStats["time"] - ((savedStats["time"] // 3600) * 3600)) // 60), int(savedStats["time"] - (savedStats["time"] // 60) * 60), round(_sessionDataUsage / 1024 / 1024, 2), round(savedStats["data"] / 1024 / 1024, 2), processedLinkCountSession ,savedStats["processed"] ) )
				break

			elif (userSelect == "e" or userSelect == "exit"):
				
				# Simple exit
				sys.exit(0)

			else:
				# User has not picked a valid option
				print("Invalid Option\nOptions: Resume (r), Search (s), Statistics (st) and Exit (e).\n")
