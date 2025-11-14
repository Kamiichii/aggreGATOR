import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";
export async function handlerLogin(cmdName, ...args) {
    if (args.length === 0) {
        throw new Error("You need to provide a username");
    }
    const userName = args[0];
    if (await getUser(userName) === undefined) {
        throw new Error("This user doesn't exist");
    }
    setUser(userName);
    console.log(`${userName} has been set as the current user`);
}
export function registerCommand(registry, cmdName, handler) {
    registry[cmdName] = handler;
}
export async function handlerRegister(cmdName, ...args) {
    if (args.length === 0) {
        throw new Error("You need to provide a username");
    }
    const userName = args[0];
    if (await getUser(userName) !== undefined) {
        throw new Error("The user already exists");
    }
    await createUser(userName);
    setUser(userName);
    console.log(`${userName} is created`);
    console.log(await getUser(userName));
}
export async function runCommand(registry, cmdName, ...args) {
    const handler = registry[cmdName];
    if (!handler)
        throw new Error(`unknown command: ${cmdName}`);
    await handler(cmdName, ...args);
}
