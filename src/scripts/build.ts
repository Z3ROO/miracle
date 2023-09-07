#!/usr/bin/env node

import esbuild from 'esbuild';
import { join } from 'path';
import fs from 'fs';
import includeBundleIntoHTML from './config/includeScripts.js';

const cwd = process.cwd();
const entryDirectory = join(cwd, 'src', 'index.tsx');

const buildDirectory = join(cwd, 'build');

const publicDir = join(cwd, 'public');

if (fs.existsSync(buildDirectory))
  fs.rmSync(buildDirectory, { recursive: true });

fs.cpSync(publicDir, buildDirectory, {recursive: true})

let htmlFile = fs.readFileSync(join(buildDirectory, 'index.html'), 'utf-8');
htmlFile = includeBundleIntoHTML(htmlFile);

fs.writeFileSync(join(buildDirectory, 'index.html'), htmlFile);

esbuild.build({
  entryPoints:[entryDirectory],
  bundle: true,
  outfile: './build/static/js/bundle.js',
  jsxFactory: 'Miracle.createElement',
  target: 'es6',
  format: 'esm',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  }
});
