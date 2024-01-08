const express = require('express');
const fs = require('fs');
const archiver = require('archiver');
const { fork } = require('child_process');

const app = express();
const port = 3000;

// Używamy wbudowanego modułu express.json() do parsowania danych JSON w żądaniach
app.use(express.json());

app.post('/compress', (req, res) => {
  const { directory } = req.body;

  if (!directory) {
    return res.status(400).json({ error: 'Missing directory parameter' });
  }

  // Log the start of the compression operation
  console.log(`Compression started for directory: ${directory}`);

  // Create a child process for compression
  const compressionProcess = fork('./compressor.js', [directory]);

  // Listen for messages from the child process
  compressionProcess.on('message', (message) => {
    // Log the end of the compression operation
    console.log(`Compression completed for directory: ${directory}. Archive saved at: ${message}`);
    // Send the archive path back to the client
    res.json({ archivePath: message });
  });

  // Handle errors from the child process
  compressionProcess.on('error', (error) => {
    console.error('Compression process error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
