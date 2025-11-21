import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";
export function middlewareLoggedIn(userCH) {
    return async (cmdName, ...args) => {
        const userName = readConfig().currentUserName;
        if (!userName)
            throw new Error("User not logged in");
        const user = await getUser(userName);
        if (!user)
            throw new Error(`User ${userName} not found`);
        await userCH(cmdName, user, ...args);
    };
}
