#!/usr/bin/env node

import { exec } from 'child_process';
import CliMaker, { ICommand, IConfig } from '@z3ro/clim';
import { build } from '../scripts/build.js';
import { dev } from '../scripts/dev.js';

const command: ICommand = {
  name: 'Test',
  description: 'Build tool for Miracle Template Engine.',
  flags: [
    {
      description: 'Build the project for production.',
      type:'boolean',
      command: 'build',
      alias: 'b',
      help: '--build or -b'
    },
    {
      description: 'Build and serve project for development on localhost',
      type:'boolean',
      command: 'dev',
      alias: 'd',
      help: '--dev or -d'
    }
  ],
  action: commandFn,
  subCommands: []
}

function commandFn(options: any) {
  if (options.build)
    build();
  if (options.dev)
    dev();
}

const tool = new CliMaker.default(command);