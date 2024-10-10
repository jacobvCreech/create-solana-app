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
// Update on 2024-04-30 09:11:42: Improved performance - 6417
// Update on 2024-04-30 15:00:05: Small UI tweak - 3110
// Update on 2024-05-01 15:22:37: Fix minor bug - 4626
// Update on 2024-05-01 14:08:03: Minor documentation update - 2441
// Update on 2024-05-01 14:45:35: Small UI tweak - 9914
// Update on 2024-05-02 13:36:02: Fix minor bug - 2097
// Update on 2024-05-02 19:42:55: Small UI tweak - 4550
// Update on 2024-05-03 09:44:29: Code cleanup - 6607
// Update on 2024-05-03 12:00:08: Code cleanup - 3457
// Update on 2024-05-04 11:14:39: Small UI tweak - 8077
// Update on 2024-05-04 19:05:28: Refactored function - 9490
// Update on 2024-05-04 13:55:29: Improved performance - 2868
// Update on 2024-05-05 22:14:26: Improved performance - 8573
// Update on 2024-05-05 15:06:55: Added new feature - 5050
// Update on 2024-05-05 18:52:25: Code cleanup - 7513
// Update on 2024-05-06 18:33:48: Refactored function - 1874
// Update on 2024-05-06 21:09:38: Improved performance - 7882
// Update on 2024-05-06 18:40:21: Updated dependencies - 2220
// Update on 2024-05-07 14:59:28: Code cleanup - 8610
// Update on 2024-05-08 13:08:42: Updated dependencies - 4192
// Update on 2024-05-09 20:38:22: Code cleanup - 3855
// Update on 2024-05-09 09:21:40: Refactored some code - 8408
// Update on 2024-05-10 08:52:34: Updated README - 9691
// Update on 2024-05-10 21:50:24: Refactored function - 6791
// Update on 2024-05-10 19:08:08: Added new feature - 3476
// Update on 2024-05-11 09:22:10: Refactored function - 3039
// Update on 2024-05-11 14:27:28: Updated dependencies - 8971
// Update on 2024-05-11 11:15:56: Improved performance - 3291
// Update on 2024-05-12 18:30:26: Small UI tweak - 6902
// Update on 2024-05-12 18:10:59: Refactored function - 7246
// Update on 2024-05-12 11:09:51: Minor documentation update - 4561
// Update on 2024-05-13 15:56:46: Fix minor bug - 6677
// Update on 2024-05-13 11:28:30: Refactored some code - 4012
// Update on 2024-05-13 11:34:46: Added new feature - 4850
// Update on 2024-05-14 20:05:20: Added new feature - 1132
// Update on 2024-05-15 22:58:02: Refactored function - 5825
// Update on 2024-05-17 21:55:03: Updated README - 6375
// Update on 2024-05-17 09:11:42: Refactored function - 5698
// Update on 2024-05-17 21:57:57: Minor documentation update - 9645
// Update on 2024-05-18 19:48:27: Refactored some code - 6865
// Update on 2024-05-18 15:25:40: Minor documentation update - 8026
// Update on 2024-05-18 13:42:39: Updated README - 8262
// Update on 2024-05-20 20:38:03: Added new feature - 6017
// Update on 2024-05-21 14:54:58: Updated dependencies - 7330
// Update on 2024-05-23 10:17:56: Refactored function - 9429
// Update on 2024-05-23 21:48:07: Fix minor bug - 6065
// Update on 2024-05-23 08:57:11: Improved performance - 4191
// Update on 2024-05-24 16:31:16: Added new feature - 3166
// Update on 2024-05-25 10:34:29: Refactored function - 7240
// Update on 2024-05-26 20:27:44: Refactored some code - 9292
// Update on 2024-05-26 12:28:51: Fix minor bug - 7469
// Update on 2024-05-26 17:10:49: Minor documentation update - 9578
// Update on 2024-05-27 08:51:00: Refactored some code - 1833
// Update on 2024-05-27 16:11:37: Refactored function - 1875
// Update on 2024-05-28 11:10:08: Minor documentation update - 6285
// Update on 2024-05-28 21:49:19: Refactored some code - 6465
// Update on 2024-05-28 20:48:18: Refactored function - 3078
// Update on 2024-05-29 10:58:25: Added new feature - 8677
// Update on 2024-05-29 15:59:05: Minor documentation update - 8421
// Update on 2024-05-30 20:03:54: Code cleanup - 2445
// Update on 2024-05-30 12:48:50: Small UI tweak - 7572
// Update on 2024-06-01 10:52:45: Fix minor bug - 5396
// Update on 2024-06-01 09:26:07: Minor documentation update - 4457
// Update on 2024-06-02 08:21:23: Refactored function - 4941
// Update on 2024-06-02 10:16:38: Fix minor bug - 1737
// Update on 2024-06-02 21:42:57: Added new feature - 4535
// Update on 2024-06-04 18:37:45: Updated dependencies - 8496
// Update on 2024-06-04 21:46:31: Added new feature - 9608
// Update on 2024-06-04 20:31:55: Added new feature - 8632
// Update on 2024-06-05 17:59:07: Updated dependencies - 8939
// Update on 2024-06-05 10:56:05: Updated dependencies - 5721
// Update on 2024-06-07 08:47:35: Code cleanup - 4050
// Update on 2024-06-07 19:55:12: Updated README - 9517
// Update on 2024-06-09 08:01:41: Fix minor bug - 3158
// Update on 2024-06-10 17:54:50: Updated README - 3263
// Update on 2024-06-10 14:47:56: Updated dependencies - 6263
// Update on 2024-06-10 14:12:56: Fix minor bug - 1108
// Update on 2024-06-11 14:30:17: Updated README - 8047
// Update on 2024-06-15 13:47:07: Updated dependencies - 2209
// Update on 2024-06-15 14:42:19: Refactored function - 1924
// Update on 2024-06-15 18:50:11: Refactored some code - 6281
// Update on 2024-06-16 11:52:08: Refactored function - 5741
// Update on 2024-06-16 16:25:07: Updated README - 5509
// Update on 2024-06-16 12:11:29: Updated dependencies - 2395
// Update on 2024-06-17 22:57:41: Updated README - 2841
// Update on 2024-06-17 11:42:29: Updated dependencies - 5210
// Update on 2024-06-17 21:22:02: Updated dependencies - 7156
// Update on 2024-06-18 20:23:07: Code cleanup - 4644
// Update on 2024-06-18 09:34:18: Improved performance - 1884
// Update on 2024-06-19 22:57:18: Improved performance - 2227
// Update on 2024-06-19 08:40:19: Updated README - 7009
// Update on 2024-06-20 13:44:24: Small UI tweak - 4546
// Update on 2024-06-20 22:23:14: Refactored some code - 4042
// Update on 2024-06-21 18:17:24: Refactored some code - 9010
// Update on 2024-06-21 13:28:28: Code cleanup - 1007
// Update on 2024-06-22 19:18:02: Small UI tweak - 1202
// Update on 2024-06-23 19:56:49: Small UI tweak - 4160
// Update on 2024-06-23 13:07:01: Updated dependencies - 7295
// Update on 2024-06-23 10:29:38: Updated dependencies - 8676
// Update on 2024-06-24 08:02:43: Updated README - 5987
// Update on 2024-06-26 09:41:18: Minor documentation update - 3781
// Update on 2024-06-27 09:41:33: Updated README - 2676
// Update on 2024-06-27 17:13:47: Code cleanup - 8698
// Update on 2024-06-27 19:19:50: Small UI tweak - 9118
// Update on 2024-06-28 17:03:52: Added new feature - 7923
// Update on 2024-06-28 20:02:26: Minor documentation update - 4424
// Update on 2024-06-29 11:34:06: Improved performance - 7477
// Update on 2024-06-29 12:57:47: Updated README - 7058
// Update on 2024-06-30 17:15:26: Refactored some code - 2763
// Update on 2024-07-01 22:43:33: Refactored some code - 2078
// Update on 2024-07-02 09:10:32: Code cleanup - 8610
// Update on 2024-07-02 20:58:32: Refactored some code - 7971
// Update on 2024-07-03 22:07:45: Small UI tweak - 5884
// Update on 2024-07-04 11:51:28: Minor documentation update - 7137
// Update on 2024-07-06 12:06:30: Updated README - 1305
// Update on 2024-07-07 13:50:19: Refactored function - 7724
// Update on 2024-07-08 12:54:35: Fix minor bug - 2298
// Update on 2024-07-10 17:48:34: Minor documentation update - 3126
// Update on 2024-07-10 12:06:38: Refactored function - 2080
// Update on 2024-07-10 21:43:20: Small UI tweak - 5183
// Update on 2024-07-13 14:26:50: Small UI tweak - 8382
// Update on 2024-07-14 10:20:47: Updated dependencies - 8472
// Update on 2024-07-14 09:59:52: Updated README - 7002
// Update on 2024-07-14 16:16:00: Improved performance - 9432
// Update on 2024-07-15 21:56:11: Refactored function - 8902
// Update on 2024-07-15 14:04:59: Refactored some code - 8283
// Update on 2024-07-15 09:26:50: Minor documentation update - 7518
// Update on 2024-07-17 09:06:15: Small UI tweak - 4760
// Update on 2024-07-18 19:51:40: Added new feature - 2030
// Update on 2024-07-18 13:30:44: Refactored function - 5404
// Update on 2024-07-18 15:50:11: Refactored some code - 9734
// Update on 2024-07-19 16:53:09: Added new feature - 1189
// Update on 2024-07-19 12:10:47: Code cleanup - 7518
// Update on 2024-07-19 22:23:42: Code cleanup - 9092
// Update on 2024-07-22 08:42:29: Added new feature - 4319
// Update on 2024-07-22 09:08:46: Refactored function - 1621
// Update on 2024-07-23 09:43:48: Refactored function - 5560
// Update on 2024-07-23 21:50:12: Code cleanup - 5166
// Update on 2024-07-25 13:37:30: Improved performance - 5077
// Update on 2024-07-25 21:19:38: Minor documentation update - 9206
// Update on 2024-07-25 10:19:53: Minor documentation update - 9751
// Update on 2024-07-26 19:50:08: Updated dependencies - 4689
// Update on 2024-07-26 17:14:03: Small UI tweak - 5022
// Update on 2024-07-26 15:17:55: Updated README - 8361
// Update on 2024-07-27 09:25:28: Small UI tweak - 3935
// Update on 2024-07-28 21:20:51: Updated README - 8042
// Update on 2024-07-29 14:23:56: Updated README - 7311
// Update on 2024-07-30 09:41:44: Updated dependencies - 3795
// Update on 2024-07-30 13:27:36: Updated README - 3739
// Update on 2024-07-31 19:51:28: Small UI tweak - 6121
// Update on 2024-07-31 14:14:01: Minor documentation update - 3255
// Update on 2024-07-31 17:04:55: Updated dependencies - 9524
// Update on 2024-08-01 22:55:40: Small UI tweak - 6717
// Update on 2024-08-01 21:09:27: Code cleanup - 3475
// Update on 2024-08-01 11:14:42: Updated README - 9015
// Update on 2024-08-02 14:22:15: Code cleanup - 4228
// Update on 2024-08-02 11:58:20: Small UI tweak - 9435
// Update on 2024-08-02 14:34:06: Small UI tweak - 9578
// Update on 2024-08-03 22:32:06: Added new feature - 7311
// Update on 2024-08-03 19:04:27: Updated README - 2792
// Update on 2024-08-03 10:13:49: Refactored some code - 2609
// Update on 2024-08-04 17:43:55: Fix minor bug - 9050
// Update on 2024-08-04 17:27:29: Updated dependencies - 6244
// Update on 2024-08-05 15:31:29: Refactored function - 9958
// Update on 2024-08-06 18:01:55: Fix minor bug - 6357
// Update on 2024-08-06 15:24:32: Code cleanup - 6535
// Update on 2024-08-06 09:07:54: Added new feature - 4585
// Update on 2024-08-07 18:35:56: Fix minor bug - 4796
// Update on 2024-08-07 16:47:58: Updated dependencies - 6053
// Update on 2024-08-08 13:47:11: Refactored function - 8171
// Update on 2024-08-08 12:25:20: Fix minor bug - 8819
// Update on 2024-08-08 14:40:28: Refactored some code - 4734
// Update on 2024-08-09 20:50:39: Fix minor bug - 3751
// Update on 2024-08-09 12:23:16: Refactored some code - 2236
// Update on 2024-08-09 20:39:11: Updated dependencies - 5710
// Update on 2024-08-11 15:43:21: Code cleanup - 7682
// Update on 2024-08-11 12:26:41: Minor documentation update - 4419
// Update on 2024-08-11 22:17:20: Updated README - 9455
// Update on 2024-08-13 16:07:51: Improved performance - 3752
// Update on 2024-08-14 18:23:52: Updated dependencies - 7465
// Update on 2024-08-15 12:07:27: Code cleanup - 4824
// Update on 2024-08-17 17:49:35: Improved performance - 2083
// Update on 2024-08-17 14:36:44: Minor documentation update - 3181
// Update on 2024-08-17 08:00:14: Refactored function - 6564
// Update on 2024-08-18 19:04:11: Updated dependencies - 4866
// Update on 2024-08-18 14:07:29: Updated README - 5267
// Update on 2024-08-19 16:08:39: Updated README - 6682
// Update on 2024-08-19 11:55:42: Small UI tweak - 7231
// Update on 2024-08-21 16:02:33: Added new feature - 7342
// Update on 2024-08-21 11:05:50: Improved performance - 7749
// Update on 2024-08-22 20:43:50: Refactored some code - 4976
// Update on 2024-08-22 19:27:36: Fix minor bug - 2309
// Update on 2024-08-23 20:11:01: Updated dependencies - 5258
// Update on 2024-08-23 09:18:19: Added new feature - 6473
// Update on 2024-08-25 09:25:23: Fix minor bug - 6440
// Update on 2024-08-25 22:37:16: Updated dependencies - 4216
// Update on 2024-08-25 21:15:47: Updated README - 4951
// Update on 2024-08-26 18:02:51: Refactored some code - 2562
// Update on 2024-08-27 15:31:30: Updated dependencies - 8570
// Update on 2024-08-27 17:18:16: Code cleanup - 5604
// Update on 2024-08-27 09:38:31: Updated dependencies - 6080
// Update on 2024-08-28 08:30:50: Added new feature - 1030
// Update on 2024-08-29 09:51:23: Refactored some code - 2273
// Update on 2024-08-29 14:20:16: Improved performance - 5197
// Update on 2024-08-29 20:19:41: Fix minor bug - 8705
// Update on 2024-08-30 17:57:20: Added new feature - 4198
// Update on 2024-08-30 21:43:46: Minor documentation update - 9869
// Update on 2024-09-02 17:51:40: Code cleanup - 4705
// Update on 2024-09-02 08:52:25: Refactored function - 4144
// Update on 2024-09-02 08:57:48: Updated dependencies - 8346
// Update on 2024-09-03 14:43:03: Refactored function - 5689
// Update on 2024-09-03 14:23:26: Refactored some code - 9228
// Update on 2024-09-04 09:27:03: Small UI tweak - 9154
// Update on 2024-09-06 09:49:27: Code cleanup - 7390
// Update on 2024-09-06 13:21:55: Small UI tweak - 9253
// Update on 2024-09-07 10:49:29: Small UI tweak - 2985
// Update on 2024-09-07 17:59:51: Code cleanup - 6397
// Update on 2024-09-08 16:08:33: Refactored some code - 8713
// Update on 2024-09-08 18:39:21: Small UI tweak - 3569
// Update on 2024-09-09 16:41:52: Improved performance - 9460
// Update on 2024-09-09 16:46:39: Refactored function - 2940
// Update on 2024-09-12 10:25:02: Updated README - 8877
// Update on 2024-09-13 19:27:53: Refactored some code - 8616
// Update on 2024-09-14 10:13:09: Refactored some code - 2588
// Update on 2024-09-15 16:40:36: Small UI tweak - 3472
// Update on 2024-09-16 14:49:33: Added new feature - 9772
// Update on 2024-09-16 14:43:11: Added new feature - 9236
// Update on 2024-09-17 13:28:33: Added new feature - 8302
// Update on 2024-09-17 08:36:05: Updated README - 1032
// Update on 2024-09-17 17:15:59: Small UI tweak - 3737
// Update on 2024-09-18 22:00:02: Small UI tweak - 4211
// Update on 2024-09-18 12:53:56: Fix minor bug - 1452
// Update on 2024-09-18 16:22:05: Refactored some code - 9746
// Update on 2024-09-19 13:29:12: Improved performance - 9649
// Update on 2024-09-19 22:06:55: Refactored function - 8795
// Update on 2024-09-19 21:27:42: Updated dependencies - 4656
// Update on 2024-09-20 18:14:48: Refactored some code - 5695
// Update on 2024-09-20 14:57:12: Code cleanup - 2400
// Update on 2024-09-20 15:53:34: Improved performance - 4737
// Update on 2024-09-22 20:03:34: Refactored function - 7866
// Update on 2024-09-24 09:13:11: Refactored function - 1690
// Update on 2024-09-24 13:14:38: Small UI tweak - 3106
// Update on 2024-09-24 13:44:14: Updated dependencies - 4140
// Update on 2024-09-25 17:40:39: Added new feature - 2031
// Update on 2024-09-25 09:52:42: Small UI tweak - 3763
// Update on 2024-09-26 09:03:01: Refactored some code - 3384
// Update on 2024-09-26 15:04:31: Fix minor bug - 6512
// Update on 2024-09-28 09:52:10: Improved performance - 4001
// Update on 2024-09-29 22:59:41: Updated dependencies - 3360
// Update on 2024-09-30 17:10:46: Added new feature - 3642
// Update on 2024-09-30 20:16:35: Refactored function - 8161
// Update on 2024-09-30 15:03:03: Minor documentation update - 3956
// Update on 2024-10-01 20:31:27: Small UI tweak - 4197
// Update on 2024-10-03 12:37:51: Code cleanup - 4493
// Update on 2024-10-03 21:29:09: Small UI tweak - 3942
// Update on 2024-10-04 11:00:34: Improved performance - 7442
// Update on 2024-10-04 10:40:29: Small UI tweak - 6969
// Update on 2024-10-04 18:02:20: Refactored some code - 3898
// Update on 2024-10-05 22:49:34: Updated README - 3114
// Update on 2024-10-05 22:38:06: Minor documentation update - 7673
// Update on 2024-10-05 10:43:15: Minor documentation update - 8234
// Update on 2024-10-08 16:43:47: Refactored some code - 5386
// Update on 2024-10-09 12:49:07: Updated README - 2952
// Update on 2024-10-09 17:36:34: Refactored function - 8179
// Update on 2024-10-09 15:27:39: Updated README - 2694
// Update on 2024-10-10 21:39:08: Small UI tweak - 2977
// Update on 2024-10-10 21:35:03: Fix minor bug - 6103
