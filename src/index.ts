#!/usr/bin/env node

import path from 'path';
import process from 'process';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import { publish } from './utilities/publish.js';
import type { DoxicityConfig } from './utilities/types';

interface CommandLineOptions {
  config: string;
  watch: boolean;
}

export const defaultConfig: DoxicityConfig = {
  assetDirName: 'assets',
  cleanBeforePublish: true,
  copyFiles: ['assets/**/*'],
  data: {},
  helpers: [],
  inputDir: process.cwd(),
  outputDir: path.join(process.cwd(), '_site'),
  partials: [],
  plugins: [],
  themeDir: path.resolve('../themes/default')
};

export { publish };

const optionDefinitions = [
  { name: 'config', alias: 'c', type: String },
  { name: 'watch', alias: 'w', type: Boolean }
];

const options: CommandLineOptions = {
  watch: false,
  config: '',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  ...(commandLineArgs(optionDefinitions) as Partial<CommandLineOptions>)
};

// Fetch the user's config
let userConfig: Partial<DoxicityConfig> = {};

if (options.config) {
  userConfig = (await import(path.resolve(options.config))) as DoxicityConfig;

  // TODO - join relative paths in user config with config dirname
  // userConfig.inputDir = path.resolve(path.join());
}

async function runPublish() {
  try {
    const config = { ...defaultConfig, ...userConfig };
    console.log(config);
    const result = await publish(config);
    const numPages = result.publishedPages.length;
    const term = numPages === 1 ? 'one page' : `${numPages} pages`;

    console.log(chalk.cyan(`Doxicity successfully published ${term} to "${config.outputDir}"`));
  } catch (err: Error | unknown) {
    console.error(chalk.red((err as Error).message ?? err));
    process.exit(1);
  }
}

// Run the initial publish
await runPublish();

if (options.watch) {
  // Watch files
  // Run publish on change
}
