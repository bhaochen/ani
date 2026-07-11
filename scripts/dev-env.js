import { homedir } from "node:os";
import { join } from "node:path";

export function defaultDevHanaHome() {
  return join(homedir(), ".ani-dev");
}

export function applyDevEnvironment(env = process.env, {
  nodeBin = process.execPath,
} = {}) {
  env.ANI_HOME = defaultDevHanaHome();
  env.HANA_DEV_NODE_BIN = nodeBin;
  return env;
}
