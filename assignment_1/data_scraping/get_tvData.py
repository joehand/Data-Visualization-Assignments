#!/usr/bin/env python
# encoding: utf-8
"""
get_tvData.py


@Author: Joe Hand
@Description: This will get the information from the wikipedia entry for "List of Television Programs By Count"
			  We will use the Wikiepedia API (http://en.wikipedia.org/w/api.php)
			  
			  Source Data: http://en.wikipedia.org/wiki/List_of_television_programs_by_episode_count
			  
			  It will output both a JSON file.
"""

#Import the necessary libraries
#	urllib2: a high-level interface for fetching data across the World Wide Web
#	re: python regular expressions
#	json: easy json exporting
#	BeautifulSoup: Beautiful Soup is a Python library designed for quick turnaround projects like screen-scraping

#note: BeautifulSoup needs to be installed
import urllib2
import re
import json
from BeautifulSoup import BeautifulSoup #bs4 not working as well. maybe use lxml instead?



#Set Our Page Title and make it URL friendly
article = "List_of_television_programs_by_episode_count"
article = urllib2.quote(article)

#Builds the handler to open API
opener = urllib2.build_opener()
opener.addheaders = [('User-agent', 'Mozilla/5.0')] #wikipedia requires user-agent

#Get the Page Content and Read it
print ("Getting HTML...")
resource = opener.open("http://en.wikipedia.org/wiki/" + article)
data = resource.read()
resource.close()

# Fetch HTML Table Rows
print("Finding the table...")
soup = BeautifulSoup(data)
table = soup.find('table', {'class': 'wikitable sortable'})

#write to an html just so we can see it
print("write to an html just so we can see it...")
f = open('tv-data.html', 'w')
f.write(table.prettify())
f.close()

#thanks to this gist for help through the rest here: https://gist.github.com/1501715
#grab all the rows
print ("Organizing Data...")
rows = table.findAll('tr')


for row in rows[0:1]:
    keys = {}
    for i, field in enumerate(row.findAll('th')):
        text = re.split('\(', field.text)[0] #cut out anything after ()
        text = re.sub('\s+','_', text).lower() #replace spaces with _ and make lowercase
        keys[i] = text

print(keys)

"""
# Column Keys, used to match the items for each row, created from header
keys = {
    0: 'program_name',
    1: 'genre',
    2: 'country_of_origin',
    3: 'episode_length',
    4: 'seasons',
    5: 'started_broadcasting',
    6: 'finished_broadcasting',
    7: 'episode_count'
}
"""

#create programs
programs = []
for row in rows[1:]:
    rowmap = {}
	#Do any data cleanup possible here
    for i, field in enumerate(row.findAll('td')):
        text = re.sub(ur'\u2013', r' ', field.text) #remove dash from empty season/genres
        if i == 7 or i == 4:
            text = re.split(r'\s+', text)[0] #remove second number from episode count (everything after space)
        elif i == 5 or i == 6:
            text = re.split( r"([A-Z])", text)[0] #grab the nice part of date
            if (text): #some dates are not given to us nicely =(, skip 'em
                text = re.split( r"-", text) #remove the day (since its not always there)
                text = text[0] + '/' + text[1] #format date to be MM/YYYY
                text = re.sub('0', '', text, 1) #remove that first weird 0 on years
        rowmap[keys[i]] = text
    programs.append(rowmap)

#Create Flat JSON file
print ("Exporting JSON Data...")
f = open('tv-data.json', 'w')
f.write(json.dumps(programs, sort_keys=True, indent=4))
f.close()

