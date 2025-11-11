import { setUser } from "./config";
export function handlerLogin(cmdName, ...args) {
    if (args.length === 0) {
        throw new Error("You need to provide a username");
    }
    const userName = args[0];
    setUser(userName);
    console.log(`${userName} has been set as the current user`);
}
export function registerCommand(registry, cmdName, handler) {
    registry[cmdName] = handler;
}
export function runCommand(registry, cmdName, ...args) {
    const handler = registry[cmdName];
    if (!handler)
        throw new Error(`unknown command: ${cmdName}`);
    handler(cmdName, ...args);
}
