# Setting directory
#setwd('/Users/hand/Sites/_projects/data_vis/i247')

# Reading CSV file for Flowing Data subscibers
series <- read.csv('/Users/hand/Sites/_projects/data_vis/i247/assignment_1/tv-data.csv')

#taking a look at a sample of the data
series[1:5,]

#loading in the portfolio package
library(portfolio)

#Data headers: name,genre,country,seasons,episode_count,episode_minutes,started_broadcasting,finished_broadcasting

#making the tree map!
map.market(id=series$name, area=series$episode_count, group=series$country, color=series$episode_count, main="TV Series")

#Lets see one by genre too!
map.market(id=series$name, area=series$episode_count, group=series$genre, color=series$episode_count, main="TV Series")

