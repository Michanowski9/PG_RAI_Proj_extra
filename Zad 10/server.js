const express = require('express');
const fs = require('fs');
const archiver = require('archiver');
const { fork } = require('child_process');

const app = express();
const port = 3000;

// Użycie wbudowanego modułu express.json() do parsowania danych JSON w żądaniach
app.use(express.json());

// Definiuje endpoint HTTP POST /compress, który obsługuje żądania kompresji.
app.post('/compress', (req, res) => {
  const { directory } = req.body;
  if (!directory) {
    return res.status(400).json({ error: 'Missing directory' });
  }

  const compressionProcess = fork('./compressor.js', [directory]);

  compressionProcess.on('message', (message) => {
    res.json({ archivePath: message });
  });

  compressionProcess.on('error', (error) => {
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
