import { readConfig, setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";

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

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  const handler = registry[cmdName];
  if (!handler) throw new Error(`unknown command: ${cmdName}`);
  await handler(cmdName, ...args);
}