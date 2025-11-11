import fs from "fs";
import os from "os";
import path from "path";
export function setUser(username) {
    const configObj = readConfig();
    configObj.currentUserName = username;
    writeConfig(configObj);
}
export function readConfig() {
    const configFile = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
    const rawConfig = JSON.parse(configFile);
    return validateConfig(rawConfig);
}
function getConfigFilePath() {
    return path.join(os.homedir(), ".gatorconfig.json");
}
function writeConfig(cfg) {
    const jsonCfg = { db_url: cfg.dbUrl, current_user_name: cfg.currentUserName };
    const jsonObj = JSON.stringify(jsonCfg);
    fs.writeFileSync(getConfigFilePath(), jsonObj, { encoding: 'utf-8' });
}
function validateConfig(rawConfig) {
    if (typeof rawConfig.db_url == "string") {
        return { dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name ?? "" };
    }
    else {
        throw new Error("This is not a proper config file");
    }
}
