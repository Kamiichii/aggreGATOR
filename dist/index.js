import { handlerLogin, registerCommand, runCommand } from "./commands.js";
function main() {
    let cmdRegistry = {};
    registerCommand(cmdRegistry, "login", handlerLogin);
    const argv = process.argv.slice(2);
    if (argv.length === 0) {
        console.error("Please enter a command");
        process.exit(1);
    }
    const [cmdName, ...args] = argv;
    try {
        runCommand(cmdRegistry, cmdName, ...args);
    }
    catch (err) {
        console.error(err.message ?? String(err));
        process.exit(1);
    }
}
main();
