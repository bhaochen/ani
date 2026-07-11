import { describe, expect, it } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

import {
  resolveAniHome,
  resolveHanaPiSdkManagedBinDir,
  resolveHanaPiSdkResourceLoaderAgentDir,
  resolveHanaPiSdkResourceLoaderCwd,
  resolveHanaPiSdkRuntimeRoot,
  resolveLegacyPiSdkManagedBinDir,
} from "../shared/hana-runtime-paths.ts";

describe("Hana runtime path contracts", () => {
  it("derives Hana-owned Pi SDK runtime paths from ANI_HOME", () => {
    const aniHome = path.join(os.tmpdir(), "hana-runtime-paths", ".ani-dev");
    const runtimeRoot = path.join(aniHome, "runtime", "pi-sdk");

    expect(resolveHanaPiSdkRuntimeRoot(aniHome)).toBe(runtimeRoot);
    expect(resolveHanaPiSdkManagedBinDir(aniHome)).toBe(path.join(runtimeRoot, "bin"));
    expect(resolveHanaPiSdkResourceLoaderCwd(aniHome)).toBe(path.join(runtimeRoot, "resource-loader", "project"));
    expect(resolveHanaPiSdkResourceLoaderAgentDir(aniHome)).toBe(path.join(runtimeRoot, "resource-loader", "agent"));
  });

  it("normalizes ANI_HOME before deriving Pi SDK paths", () => {
    const homeDir = path.join(os.tmpdir(), "hana-runtime-home");

    expect(resolveAniHome("~/.ani-dev", homeDir)).toBe(path.join(homeDir, ".ani-dev"));
  });

  it("keeps legacy Pi binary lookup explicit without creating either tree", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "hana-runtime-dirs-"));
    const aniHome = path.join(root, ".ani");

    expect(resolveLegacyPiSdkManagedBinDir(aniHome)).toBe(
      path.join(aniHome, ".pi", "agent", "bin"),
    );
    expect(resolveHanaPiSdkManagedBinDir(aniHome)).toBe(
      path.join(aniHome, "runtime", "pi-sdk", "bin"),
    );

    expect(fs.existsSync(aniHome)).toBe(false);
    fs.rmSync(root, { recursive: true, force: true });
  });
});
