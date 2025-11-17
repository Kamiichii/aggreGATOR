import { readConfig, setUser } from "./config.js";
import {CommandsRegistry, handlerAddFeed, handlerAggregate, handlerListFeeds, handlerListUsers, handlerLogin, handlerRegister, handlerReset, registerCommand, runCommand} from "./commands.js";


async function main() {
  let cmdRegistry:CommandsRegistry = {};
  registerCommand(cmdRegistry,"login",handlerLogin);
  registerCommand(cmdRegistry, "register", handlerRegister);
  registerCommand(cmdRegistry,"reset",handlerReset);
  registerCommand(cmdRegistry,"users",handlerListUsers);
  registerCommand(cmdRegistry,"agg",handlerAggregate);
  registerCommand(cmdRegistry,"addfeed",handlerAddFeed);
  registerCommand(cmdRegistry,"feeds",handlerListFeeds);
  const argv = process.argv.slice(2);
  if (argv.length === 0){
    console.error("Please enter a command");
    process.exit(1);
  }
    

  const [cmdName,...args] = argv;
  try {
    await runCommand(cmdRegistry, cmdName, ...args);
  } catch (err: any) {
    console.error(err.message ?? String(err));
    process.exit(1);
  }

process.exit(0);
}

main();