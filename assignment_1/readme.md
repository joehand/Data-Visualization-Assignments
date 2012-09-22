
#Assignment 1 
##From iSchool, Berkeley Information Visualization Class (i247s12)

[The assignment](http://blogs.ischool.berkeley.edu/i247s12/course-requirements/assignment-1/) is to design a small static visualization using the [longest running TV-series data](http://blogs.ischool.berkeley.edu/i247s12/files/2012/01/TV-series-1.xls) from Wikipedia.

The data is available cleaned as an excel file on the course website. I decided to have some fun and learn some by grabbing it from Wikipedia.

## Using Python to Grab the Data

The file ***get_tvData.py*** has the script I used to grab the data from Wikipedia. Wikipedia has an API they suggest to use. It was easiest to just grab the straight HTML through the API then parse it using Beautiful Soup.

Method for getting data:

1. Grab HTML page through API
2. Parse using Beautiful Soup, Find my table
3. Go through each row to get TV-series data
4. Do some cleanup to take out strange characters or formatting
5. Print into a JSON file

That's it! Check out the code for full comments. There will be a little more cleanup that needs to be done by hand unfortunately.

[This gist](https://gist.github.com/1501715) was really helpful.

### JSON Format

Here is a sample JSON entry: 

	{
        "country": "United States", 
        "episode_count": "00486", 
        "episode_minutes": "30", 
        "finished_broadcasting": "", 
        "genre": "Animated Sitcom", 
        "name": "The Simpsons", 
        "seasons": "22", 
        "started_broadcasting": "1989-12-17"
    }

Some notes:

* `"finished_broadcasting"` is empty if it is currently in production
* A show may not actually have `"seasons"`
* `"episode_minutes"` vary for some shows
* Some stuff is unicode for foreign languages