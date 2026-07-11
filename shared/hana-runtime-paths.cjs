const os = require("os");
const path = require("path");

function expandHome(input, homeDir = os.homedir()) {
  if (!input) return input;
  if (input === "~") return homeDir;
  if (input.startsWith("~/") || input.startsWith("~" + path.sep)) {
    return path.join(homeDir, input.slice(2));
  }
  return input;
}

function resolveAniHome(input, homeDir = os.homedir()) {
  const raw = input || path.join(homeDir, ".ani");
  return path.resolve(expandHome(raw, homeDir));
}

function assertAniHome(aniHome, caller) {
  if (!aniHome || typeof aniHome !== "string") {
    throw new Error(`${caller}: aniHome is required`);
  }
}

function resolveHanaPiSdkRuntimeRoot(aniHome) {
  assertAniHome(aniHome, "resolveHanaPiSdkRuntimeRoot");
  return path.join(aniHome, "runtime", "pi-sdk");
}

function resolveHanaPiSdkManagedBinDir(aniHome) {
  return path.join(resolveHanaPiSdkRuntimeRoot(aniHome), "bin");
}

function resolveHanaPiSdkResourceLoaderCwd(aniHome) {
  return path.join(resolveHanaPiSdkRuntimeRoot(aniHome), "resource-loader", "project");
}

function resolveHanaPiSdkResourceLoaderAgentDir(aniHome) {
  return path.join(resolveHanaPiSdkRuntimeRoot(aniHome), "resource-loader", "agent");
}

function resolveLegacyPiSdkManagedBinDir(aniHome) {
  assertAniHome(aniHome, "resolveLegacyPiSdkManagedBinDir");
  return path.join(aniHome, ".pi", "agent", "bin");
}

module.exports = {
  resolveAniHome,
  resolveHanaPiSdkManagedBinDir,
  resolveHanaPiSdkResourceLoaderAgentDir,
  resolveHanaPiSdkResourceLoaderCwd,
  resolveHanaPiSdkRuntimeRoot,
  resolveLegacyPiSdkManagedBinDir,
};
