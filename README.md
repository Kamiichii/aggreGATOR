# aggreGATOR
Gator is a RSS feed aggregator CLI app. It lets you to create different users, create new feeds, select which feeds
to follow on which users, choese an inteval for the app to search these feeds for any updates and print these updates 
to the console anytime you want 

After downloading the app there are few commands you can run:
`npm run start login (username)` this command lets you to login as a user that you have already registered
`npm run start register (username)` this command lets you to register a new user
`npm run start reset` this command lets you to reset all of the database including any users and feeds these users added to the database
`npm run start users` this command lets you to see all registered users
`npm run agg (1s|1m|1h)` this commands tells the program to start checking the followed feeds for new updates every given interval
you have to give the interval in the shown format like `30s` for every 30 seconds or `15m` for 15 minutes you cant couple them like `1m 15s` this would act as if you have written `1m` after choosing the interval open a new terminal to browse these updates
any time you want but do not close the terminal running the aggregation command if you want to stop the aggregation you can press 
ctrl + c also you might see an error starting with `Error while scraping feeds: DrizzleQueryError: Failed query: insert into` this is not a problem as long as your aggregation program doesnt crash everything will run as intended
`npm run start addfeed (feed's name) (url)` this lets you to add a new feed to the database it also automatically follows the feed with the user that is currently logged in
`npm run start feeds` this shows the feeds that are already in the database
`npm run start followfeed (url)` this follows the given feed with the currently logged in user
`npm run start following` this lists every feed that the currently logged in user is following
`npm run start unfollow (url)` this unfollows the given feed for the logged in user
`npm run start browse (number)` only use this if you are already aggregating the followed feeds, this shows the last x amount 
of feeds that are updated x being the number you have provided when you enter this command

