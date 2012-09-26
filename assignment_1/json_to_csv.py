#!/usr/bin/env python
# encoding: utf-8
"""
get_tvData.py


@Author: Joe Hand
@Description: Convert JSON to CSV for making a treemap in R.
"""


"""
JSON FORMAT:

{
    "country_of_origin": "United States", 
    "episode_count": "02725", 
    "episode_length": "59", 
    "finished_broadcasting": "2009-02-20", 
    "genre": "Talk ShowVariety Show", 
    "program_name": "Late Night with Conan O'Brien", 
    "seasons": "", 
    "started_broadcasting": "1993-09-13"
}

"""

#Import the necessary libraries
#	json: easy json exporting

import json
import csv

#open our clean JSON file
f = open('tv-data_clean.json')
data = json.load(f)
f.close()
print('got data')

#make new CSV file to save data to
f = open('tv-data.csv', 'w')
csv_file = csv.writer(f)

print('writing...')


# Write CSV Header
csv_file.writerow(["name", "genre", "country", "seasons", "episode_count", "episode_minutes", "started_broadcasting", "finished_broadcasting"])


#make new CSV row for each JSON object
for item in data:
   #write row, need to be careful encoding a couple items
  csv_file.writerow([item['name'].encode('utf-8'), item['genre'], item['country'], item['seasons'], item['episode_count'], item['episode_minutes'].encode('utf-8'), item['started_broadcasting'], item['finished_broadcasting']])

f.close()