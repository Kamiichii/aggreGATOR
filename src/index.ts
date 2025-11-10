import { readConfig, setUser } from "./config.js";


function main() {
  setUser("Kamiichii",readConfig());
  const newConfig = readConfig();
  console.log(newConfig);
}

main();