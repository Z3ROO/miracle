import { exec } from 'child_process';
import CliMaker, { ICommand, IConfig } from '@z3ro/clim';

const command: ICommand = {
  name: 'Test',
  description: 'Build tool for Miracle Template Engine.',
  flags: [
    {
      description: 'Define a name for the project',
      type:'string',
      command: 'name',
      alias: 'n',
      help: '--name project-name'
    }
  ],
  action: commandFn,
  subCommands: []
}

function commandFn(options: any) {
  console.log(options);
}

const tool = new CliMaker.default(command);