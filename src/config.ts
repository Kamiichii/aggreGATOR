import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string;
    currentUserName:string;
};

export function setUser(username:string,configObj:Config){
    configObj.currentUserName = username;
    writeConfig(configObj);

}

export function readConfig(){
   const configFile = fs.readFileSync(getConfigFilePath(),{encoding:"utf-8"});
   const rawConfig = JSON.parse(configFile);
   return validateConfig(rawConfig);

}

function getConfigFilePath(): string{
    return path.join(os.homedir(),".gatorconfig.json") ;
}

function writeConfig(cfg:Config):void{
    const jsonCfg = {db_url:cfg.dbUrl,current_user_name:cfg.currentUserName};
    const jsonObj = JSON.stringify(jsonCfg);
    fs.writeFileSync(getConfigFilePath(),jsonObj,{encoding:'utf-8'});
}

function validateConfig(rawConfig:any):Config{
    if(typeof rawConfig.db_url == "string"){
        return {dbUrl:rawConfig.db_url,currentUserName:rawConfig.current_user_name ?? ""};
    }
    else{
        throw new Error("This is not a proper config file");
    }
}