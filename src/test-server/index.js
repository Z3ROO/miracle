import express from 'express';
import path, { join } from 'path';
import fs from 'fs';

const cwd = process.cwd();

const app = express();

app.use(express.json());
app.use(express.static(path.join(cwd ,'dev-build')));

app.get("/", (req, res) => {
  res.sendFile('index.html');
})

app.listen('3000', () =>{
  console.log('Server listening on port 3000')
});

process.on('exit', cleanUp);
process.on('beforeExit', cleanUp);
process.on('SIGINT', process.exit);

function cleanUp() {
  const buildDirectory = join(cwd, 'dev-build');

  if (fs.existsSync(buildDirectory))
    fs.rmSync(buildDirectory, { recursive: true });
}