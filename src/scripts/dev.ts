import esbuild from 'esbuild';
import { join } from 'path';
import fs from 'fs';

const cwd = process.cwd();
const entryDirectory = join(cwd, 'src', 'index.tsx');

const buildDirectory = join(cwd, 'dev-build');

const publicDir = join(cwd, 'public');

if (fs.existsSync(buildDirectory))
  fs.rmdirSync(buildDirectory, { recursive: true });

fs.cpSync(publicDir, buildDirectory, {recursive: true})

let htmlFile = fs.readFileSync(join(buildDirectory, 'index.html'), 'utf-8');
htmlFile = includeBundleIntoHTML(htmlFile);

fs.writeFileSync(join(buildDirectory, 'index.html'), htmlFile);

esbuild.build({
  entryPoints:[entryDirectory],
  bundle: true,
  outfile: './dev-build/static/js/bundle.js',
  jsxFactory: 'Miracle.createElement',
  target: 'es6',
  format: 'esm',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  }
});

function includeBundleIntoHTML(htmlFile) {
  const headTagIndex = htmlFile.match(/<\/head>/).index;

  const leftHalf = htmlFile.substring(0, headTagIndex);
  const rightHalf = htmlFile.substring(headTagIndex);

  const middle = `
    <script src="static/js/bundle.js" type="module"></script>
  `;

  return leftHalf+middle+rightHalf;
}
