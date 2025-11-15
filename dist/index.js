import { handlerListUsers, handlerLogin, handlerRegister, handlerReset, registerCommand, runCommand } from "./commands.js";
async function main() {
    let cmdRegistry = {};
    registerCommand(cmdRegistry, "login", handlerLogin);
    registerCommand(cmdRegistry, "register", handlerRegister);
    registerCommand(cmdRegistry, "reset", handlerReset);
    registerCommand(cmdRegistry, "users", handlerListUsers);
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
