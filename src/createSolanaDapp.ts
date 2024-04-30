import chalk from "chalk";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

import {
    defaultUiFramework, defaultProgramFramework
} from './helpers/constants';
import { 
    downloadFiles, validateFramework
} from './helpers/framework';
import {
    shouldUseGit, tryGitInit
} from './helpers/git';
import {
    shouldUseSolana
} from './helpers/solana';
import { 
    renderProgramTemplates
} from './helpers/template';
import { 
    installDeps, shouldUseYarn, shouldUseYarnWorkspaces 
} from './helpers/yarn';


export async function createSolanaDapp({
    dappPath,
    framework,
    program,
}: {
    dappPath: string;
    framework?: string;
    program?: string;
}): Promise<void> {

    console.log();
    console.log(`Creating Solana dApp: ${dappPath}`);
    console.log();

    const root: string = path.resolve(dappPath);
    const dappName: string = path.basename(root);

    if (framework) {
        await validateFramework(framework, "UI");
    } else {
        framework = defaultUiFramework;
    };
    if (program) {
        await validateFramework(program, "program");
    } else {
        program = defaultProgramFramework;
    };

    console.log(`${chalk.magentaBright("    UI Framework      : ")} ${framework}`);
    console.log(`${chalk.magentaBright("    Program Framework : ")} ${program}`);
    console.log();

    if (fs.existsSync(root)) {
        console.log();
        console.error(`${chalk.redBright("Error:")} directory exists: ${root}`);
        console.log();
        process.exit(1);
    }

    console.log("Building...");
    console.log();
    await fsExtra.ensureDir(root);
    await fsExtra.ensureDir(root + "/app");
    await fsExtra.ensureDir(root + "/temp"); // program dir is created during clone step
    
    shouldUseSolana();
    shouldUseGit();
    shouldUseYarn();
    shouldUseYarnWorkspaces();

    console.log();
    console.log("Downloading templates...");
    console.log();
    await downloadFiles(framework, program, root, dappName);

    console.log();
    console.log("Extracting...");
    console.log();
    await renderProgramTemplates(root, dappName, program);

    console.log();
    console.log(`Installing dependencies for ${chalk.magentaBright(framework)} UI framework...`);
    console.log();
    await installDeps(root + "/app");

    console.log();
    console.log(`Installing dependencies for ${chalk.magentaBright(program)} program framework...`);
    console.log();
    await installDeps(root + "/program");

    console.log();
    console.log("Initializing git...");
    console.log();
    if (tryGitInit(root)) {
        console.log("Initialized new git repository.");
        console.log();
    };

    console.log();
    console.log(`${chalk.greenBright("  Done!")}`);
    console.log();
    console.log(`Successfully created Solana dApp: ${chalk.greenBright(dappName)}!`);
    console.log();
    console.log(`${chalk.magentaBright("  Happy dApp Hacking!")}`);
    console.log();
}// Update on 2024-04-10 12:03:07: Minor documentation update - 1501
// Update on 2024-04-10 09:08:35: Fix minor bug - 4504
// Update on 2024-04-12 22:25:21: Updated README - 2854
// Update on 2024-04-12 16:33:38: Refactored function - 2468
// Update on 2024-04-13 21:23:19: Refactored some code - 3271
// Update on 2024-04-13 11:00:18: Refactored function - 6543
// Update on 2024-04-13 20:50:29: Improved performance - 4604
// Update on 2024-04-14 22:54:55: Added new feature - 1331
// Update on 2024-04-16 13:28:43: Refactored some code - 6321
// Update on 2024-04-17 17:44:44: Added new feature - 2585
// Update on 2024-04-17 10:27:30: Small UI tweak - 7575
// Update on 2024-04-18 14:27:35: Refactored some code - 2234
// Update on 2024-04-18 13:44:18: Small UI tweak - 5717
// Update on 2024-04-18 22:18:08: Updated README - 9709
// Update on 2024-04-19 16:22:18: Code cleanup - 7801
// Update on 2024-04-19 22:45:18: Updated dependencies - 5454
// Update on 2024-04-20 14:37:15: Added new feature - 4458
// Update on 2024-04-20 13:21:34: Updated README - 6507
// Update on 2024-04-22 17:15:40: Refactored function - 2080
// Update on 2024-04-22 18:03:50: Minor documentation update - 8532
// Update on 2024-04-22 12:31:19: Refactored function - 1736
// Update on 2024-04-23 09:35:52: Added new feature - 5958
// Update on 2024-04-23 13:58:11: Refactored some code - 2658
// Update on 2024-04-23 17:46:58: Updated README - 6862
// Update on 2024-04-24 17:32:57: Minor documentation update - 1132
// Update on 2024-04-24 15:06:25: Improved performance - 5364
// Update on 2024-04-25 12:36:07: Refactored some code - 8758
// Update on 2024-04-26 16:47:06: Small UI tweak - 1025
// Update on 2024-04-27 11:18:21: Updated dependencies - 6755
// Update on 2024-04-28 12:16:11: Refactored function - 6564
// Update on 2024-04-28 11:28:44: Refactored function - 7524
// Update on 2024-04-28 10:40:46: Small UI tweak - 3326
// Update on 2024-04-29 15:27:10: Updated dependencies - 5504
// Update on 2024-04-29 15:31:21: Updated README - 6925
// Update on 2024-04-30 21:35:59: Added new feature - 2397
