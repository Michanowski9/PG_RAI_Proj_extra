const fs = require('fs');
const archiver = require('archiver');

const directory = process.argv[2];

if (!directory) {
  console.error('Missing directory parameter');
  process.exit(1);
}

const output = fs.createWriteStream(`${directory}\\..\\.zip`);
const archive = archiver('zip', { zlib: { level: 9 } });

archive.pipe(output);
archive.directory(directory, false);
archive.finalize();


output.on('close', () => {
  process.send(`${directory}\..\\.zip`);
  process.exit(0);
});

archive.on('error', (err) => {
  console.error('Compression error:', err);
  process.exit(1);
});
