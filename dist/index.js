import { handlerAddFeed, handlerAggregate, handlerFollowFeed, handlerFollowing, handlerListFeeds, handlerListUsers, handlerLogin, handlerRegister, handlerReset, handlerUnfollowFeed, registerCommand, runCommand } from "./commands.js";
import { middlewareLoggedIn } from "./middleware.js";
async function main() {
    let cmdRegistry = {};
    registerCommand(cmdRegistry, "login", handlerLogin);
    registerCommand(cmdRegistry, "register", handlerRegister);
    registerCommand(cmdRegistry, "reset", handlerReset);
    registerCommand(cmdRegistry, "users", handlerListUsers);
    registerCommand(cmdRegistry, "agg", handlerAggregate);
    registerCommand(cmdRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(cmdRegistry, "feeds", handlerListFeeds);
    registerCommand(cmdRegistry, "follow", middlewareLoggedIn(handlerFollowFeed));
    registerCommand(cmdRegistry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(cmdRegistry, "unfollow", middlewareLoggedIn(handlerUnfollowFeed));
    const argv = process.argv.slice(2);
    if (argv.length === 0) {
        console.error("Please enter a command");
        process.exit(1);
    }
    const [cmdName, ...args] = argv;
    try {
        await runCommand(cmdRegistry, cmdName, ...args);
    }
    catch (err) {
        console.error(err.message ?? String(err));
        process.exit(1);
    }
    process.exit(0);
}
main();
