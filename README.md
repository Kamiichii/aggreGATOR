aggreGator is a RSS feed aggregator CLI app. It lets you create different users, create new feeds, select which feeds
to follow on which users, choose an inteval for the app to search these feeds for any updates and print these updates 
to the console anytime you want 

## Requirements

- PostgreSQL 16+
- Node.js and npm


## Installation

1. Clone the repo
2. Install dependencies:
    ```bash
   npm install


After that you want to do is to is to download and install postgres sql:
- macOS with brew

`brew install postgresql@16`

- Linux / WSL (Debian). Here are the docs from Microsoft, but simply:

```
sudo apt update
sudo apt install postgresql postgresql-contrib 
```

Ensure the installation worked. The psql command-line utility is the default client for Postgres. Use it to make sure you're on version 16+ of Postgres:
`psql --version`

- (Linux only) Update postgres password:
`sudo passwd postgres`

- Enter a password, and be sure you won't forget it. You can just use something easy like postgres.

- Start the Postgres server in the background

- Mac: `brew services start postgresql@16`

- Linux: `sudo service postgresql start`

- Connect to the server. I recommend simply using the psql client. It's the "default" client for Postgres, and it's a great way to interact with the database. While it's not as user-friendly as a GUI like PGAdmin, it's a great tool to be able to do at least basic operations with.
Enter the psql shell:

Mac: `psql postgres`

Linux: `sudo -u postgres psql`

You should see a new prompt that looks like this:

`postgres=#`

- Create a new database. I called mine gator:
`CREATE DATABASE gator;`

- Connect to the new database:
`\c gator`

You should see a new prompt that looks like this:

`gator=#`

- Set the user password (Linux only)
`ALTER USER postgres PASSWORD 'postgres';`

For simplicity, I used postgres as the password. Before, we altered the system user's password, now we're altering the database user's password.

Query the database
From here you can run SQL queries against the gator database. For example, to see the version of Postgres you're running, you can run:

`SELECT version();`

You can type exit or use \q to leave the psql shell.

then create a new .gatorconfig.json in the folder the app is in and then write:
- `{"db_url":"postgres://postgres:postgres@localhost:5432/gator?sslmode=disable","current_user_name":"Your username here"}`
inside the file

After downloading the app there are few commands you can run:
* `npm run start login (username)` this command lets you to login as a user that you have already registered
* `npm run start register (username)` this command lets you to register a new user
* `npm run start reset` this command lets you to reset all of the database including any users and feeds these users added to the database
* `npm run start users` this command lets you to see all registered users
* `npm run agg (1s|1m|1h)` this commands tells the program to start checking the followed feeds for new updates every given interval
you have to give the interval in the shown format like `30s` for every 30 seconds or `15m` for 15 minutes you cant combine them like `1m 15s` this would act as if you have written `1m` after choosing the interval open a new terminal to browse these updates
any time you want but do not close the terminal running the aggregation command. If you want to stop the aggregation you can press 
ctrl + c also you might see an error starting with `Error while scraping feeds: DrizzleQueryError: Failed query: insert into` this is not a problem, as long as your aggregation program doesnt crash everything will run as intended
* `npm run start addfeed (feed's name) (url)` this lets you to add a new feed to the database, it also automatically follows the feed with the user that is currently logged in
* `npm run start feeds` this shows the feeds that are already in the database
* `npm run start followfeed (url)` this follows the given feed with the currently logged in user
* `npm run start following` this lists every feed that the currently logged in user is following
* `npm run start unfollow (url)` this unfollows the given feed for the logged in user
* `npm run start browse (number)` only use this if you are already aggregating the followed feeds. This shows the last x amount 
of feeds that are updated, x being the number you have provided when you enter this command


## Quick Start

1. Set up Postgres and create a `gator` database.
2. Create `.gatorconfig.json` with your DB URL and a `current_user_name`.
3. Run `npm install`.
4. Run `npm run start register <username>`.
5. Run `npm run start login <username>`.
6. Add a feed: `npm run start addfeed "My Feed" https://example.com/rss`.
7. Start aggregation: `npm run agg 30s`.
8. In another terminal, browse items: `npm run start browse 10`.



