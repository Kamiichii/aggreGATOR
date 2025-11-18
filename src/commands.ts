import { symlinkSync } from "fs";
import { readConfig, setUser } from "./config";
import { createUser, getUser, getUsers, resetUsers } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";
import { createFeed, getFeeds, getUserOfTheFeed, printFeed } from "./lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feedFollow";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry =Record<string,CommandHandler>;

export async function handlerLogin(cmdName:string ,...args:string[]){
    if(args.length === 0){
        throw new Error("You need to provide a username");
    }

    const userName = args[0];
     
    if(await getUser(userName) === undefined){
        throw new Error("This user doesn't exist");
    }
    
    setUser(userName);
    console.log(`${userName} has been set as the current user`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export async function handlerRegister(cmdName:string ,...args:string[]){
    if(args.length === 0){
        throw new Error("You need to provide a username");
    }

    const userName = args[0];

    if (await getUser(userName) !== undefined){
        throw new Error("The user already exists")
    }

    await createUser(userName);
    setUser(userName);
    console.log(`${userName} is created`);
    console.log(await getUser(userName));

}
export async function handlerReset() {
    try{
        await resetUsers();
    }catch(err){
        throw new Error("Couldnt reset the database");
    }
}
export async function handlerListUsers() {
    const users = await getUsers();
    const currentUser = readConfig().currentUserName;
    for(const user of users){
        if(user.name ===currentUser){
            console.log(`${user.name} (current)`);
        }
        else{
            console.log(user.name);
        }
    }
}

export async function handlerListFeeds() {
    const feeds = await getFeeds();
    for(const feed of feeds){
        const userName = await getUserOfTheFeed(feed);
        console.log(feed.name);
        console.log(feed.url);
        console.log(userName);
    }
}

export async function handlerAggregate(URL:string){
    const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(JSON.stringify(feed, null, 2));
}

export async function handlerAddFeed(cmdName:string,name:string,url:string) {
  const feed = await createFeed(name, url)
  const user = await getUser(readConfig().currentUserName)
  await createFeedFollow(url);
  printFeed(feed,user);

}

export async function handlerFollowFeed(cmdName:string,url:string){
    const feedFollow = await createFeedFollow(url);
    console.log(`user: ${feedFollow.userName}`);
    console.log(`feed: ${feedFollow.feedName}`);

}

export async function handlerFollowing(cmdName:string) {
    const currentUserName = readConfig().currentUserName;
    const feedFollows = await getFeedFollowsForUser(currentUserName);
    for(const feed of feedFollows){
        console.log(feed.feeds.name);
    }
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  const handler = registry[cmdName];
  if (!handler) throw new Error(`unknown command: ${cmdName}`);
  await handler(cmdName, ...args);
}

