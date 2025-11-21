import { CommandHandler, UserCommandHandler } from "./commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;


 export function middlewareLoggedIn(userCH:UserCommandHandler): CommandHandler{
    return async (cmdName: string, ...args: string[]) => {

        const userName = readConfig().currentUserName;
        if(!userName) throw new Error("User not logged in");
        const user = await getUser(userName);
        if (!user) throw new Error(`User ${userName} not found`);
        await userCH(cmdName, user, ...args);
 }
}