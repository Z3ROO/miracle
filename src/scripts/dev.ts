#!/usr/bin/env node

import esbuild, { build } from 'esbuild';
import { join } from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import includeBundleIntoHTML from './config/includeScripts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cwd = process.cwd();

const entryDirectory = join(cwd, 'src', 'index.tsx');
const buildDirectory = join(__dirname, '../', 'dev-build');
const publicDir = join(cwd, 'public');

//Removes dev-build folder if exists
if (fs.existsSync(buildDirectory))
  fs.rmSync(buildDirectory, { recursive: true });

//Copy users actual public folder to serve
fs.cpSync(publicDir, buildDirectory, {recursive: true});

let htmlFile = fs.readFileSync(join(buildDirectory, 'index.html'), 'utf-8');
htmlFile = includeBundleIntoHTML(htmlFile);

fs.writeFileSync(join(buildDirectory, 'index.html'), htmlFile);

const ctx = await esbuild.context({
  entryPoints:[entryDirectory],
  bundle: true,
  outfile: join(buildDirectory, 'static', 'js', 'bundle.js'),
  jsxFactory: 'Miracle.createElement',
  target: 'es6',
  format: 'esm',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  }
});

let { host, port } = await ctx.serve({
  servedir: buildDirectory,
})

console.log(host,'   ----   ', port);

