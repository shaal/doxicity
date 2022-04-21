#!/usr/bin/env node

import { existsSync } from 'fs';
import path from 'path';
import process from 'process';
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import chalk from 'chalk';
import chokidar from 'chokidar';
import commandLineArgs from 'command-line-args';
import { copyAssets, publish } from './utilities/publish.js';
import type { DoxicityConfig } from './utilities/types';

const currentDir = new URL('.', import.meta.url).pathname;
let targetDirectory = process.cwd();

interface CommandLineOptions {
  dir: string;
  watch: boolean;
}

export const defaultConfig: DoxicityConfig = {
  assetDirName: 'assets',
  cleanOnPublish: true,
  copyFiles: ['assets/**/*'],
  data: {},
  helpers: [],
  inputDir: '.',
  outputDir: '_site',
  partials: [],
  plugins: [],
  themeDir: path.join(currentDir, '../themes/default')
};

export { publish };

// Fetch command line options
const options: CommandLineOptions = {
  dir: targetDirectory,
  watch: false,
  ...(commandLineArgs([
    { name: 'dir', alias: 'd', type: String },
    { name: 'watch', alias: 'w', type: Boolean }
  ]) as Partial<CommandLineOptions>)
};

// Switch to the target directory
if (options.dir) {
  try {
    targetDirectory = path.resolve(options.dir);
    process.chdir(targetDirectory);
  } catch (err) {
    console.error(chalk.red(`Invalid target directory: "${options.dir}"`));
    process.exit(1);
  }
}

// Fetch the user's config
const userConfigFilename = path.join(targetDirectory, 'doxicity.config.js');
let userConfig: Partial<DoxicityConfig> = {};
if (existsSync(userConfigFilename)) {
  userConfig = (await import(userConfigFilename)) as Partial<DoxicityConfig>;
} else {
  console.warn(chalk.yellow(`No config filed found at "${userConfigFilename}". Using default config.`));
}

// Combine both configs
const config = { ...defaultConfig, ...userConfig };
console.log(config);

async function runPublish() {
  try {
    const result = await publish(config);
    const numPages = result.publishedPages.length;
    const term = numPages === 1 ? 'one page' : `${numPages} pages`;

    console.log(chalk.green(`Doxicity successfully published ${term} to "${config.outputDir}"`));
  } catch (err: Error | unknown) {
    console.error(chalk.red((err as Error).message ?? err));
    process.exit(1);
  }
}

// Run the initial publish
await runPublish();

// Watch files
if (options.watch) {
  console.log(`Watching for changes in: ${targetDirectory}`);

  const markdownWatcher = chokidar.watch([path.join(targetDirectory, '**/*')], {
    persistent: true,
    ignored: [path.resolve(config.outputDir)],
    ignoreInitial: true
  });

  markdownWatcher
    .on('add', async filename => {
      if (filename.endsWith('.md')) {
        console.log(`New page created: "${filename}"`);
        await runPublish();
      } else {
        console.log(`New file created: "${filename}"`);
        await copyAssets(config);
      }
    })
    .on('change', async filename => {
      if (filename.endsWith('.md')) {
        console.log(`Page changed: "${filename}"`);
        await runPublish();
      } else {
        console.log(`File changed: "${filename}"`);
        await copyAssets(config);
      }
    })
    .on('unlink', async filename => {
      if (filename.endsWith('.md')) {
        console.log(`Page removed: "${filename}"`);
        await runPublish();
      } else {
        console.log(`File removed: "${filename}"`);
        await copyAssets(config);
      }
    });
}
