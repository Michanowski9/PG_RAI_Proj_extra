const fs = require('fs');
const archiver = require('archiver');

const directory = process.argv[2];

if (!directory) {
  console.error('Missing directory parameter');
  process.exit(1);
}

// Create output stream for the archive
const output = fs.createWriteStream(`${directory}.zip`);
const archive = archiver('zip', { zlib: { level: 9 } });

// Pipe archive data to the output file
archive.pipe(output);

// Append all files and directories in the given directory to the archive
archive.directory(directory, false);

// Finalize the archive and close the output stream
archive.finalize();

// Listen for the 'close' event of the output stream
output.on('close', () => {
  // Send a message back to the parent process with the path of the created archive
  process.send(`${directory}.zip`);
  // Exit the child process
  process.exit(0);
});

// Handle errors during compression
archive.on('error', (err) => {
  console.error('Compression error:', err);
  process.exit(1);
});
