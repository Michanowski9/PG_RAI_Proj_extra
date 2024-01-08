// Importuje moduł express, który jest frameworkiem do budowania aplikacji sieciowych w Node.js.
const express = require('express');
//  Importuje moduł fs (file system), który dostarcza funkcje do operacji na systemie plików.
const fs = require('fs');
// Importuje moduł archiver, który umożliwia tworzenie archiwów.
const archiver = require('archiver');
// Destrukturyzuje obiekt child_process z modułu child_process. Umożliwia to uruchamianie nowych procesów (w tym przypadku dla kompresji w oddzielnym wątku).
const { fork } = require('child_process');

// Tworzy instancję aplikacji Express.
const app = express();
//Określa numer portu, na którym aplikacja będzie nasłuchiwać.
const port = 3000;

// Używamy wbudowanego modułu express.json() do parsowania danych JSON w żądaniach
// Dodaje middleware do aplikacji Express, aby automatycznie parsować dane JSON z przychodzących żądań.
app.use(express.json());

// Definiuje endpoint HTTP POST /compress, który obsługuje żądania kompresji.
app.post('/compress', (req, res) => {
  // Wyciąga z treści żądania wartość klucza directory z obiektu JSON.
  const { directory } = req.body;

  // Sprawdza, czy klucz directory został przesłany w treści żądania. Jeśli nie, zwraca błąd 400
  if (!directory) {
    return res.status(400).json({ error: 'Missing directory parameter' });
  }

  // Log the start of the compression operation
  // Loguje informację o rozpoczęciu operacji kompresji dla określonego katalogu
  console.log(`Compression started for directory: ${directory}`);

  // Create a child process for compression
  // Uruchamia nowy proces (fork) dla pliku compressor.js, przekazując mu ścieżkę katalogu jako argument.
  const compressionProcess = fork('./compressor.js', [directory]);

  // Listen for messages from the child process
  // Nasłuchuje na zdarzenie przesłania wiadomości z procesu potomnego, aby otrzymać ścieżkę do utworzonego archiwum.
  compressionProcess.on('message', (message) => {
    // Log the end of the compression operation
    console.log(`Compression completed for directory: ${directory}. Archive saved at: ${message}`);
    // Send the archive path back to the client
    res.json({ archivePath: message });
  });

  // Handle errors from the child process
  //Nasłuchuje na zdarzenie błędu z procesu potomnego i obsługuje go w razie potrzeby.
  compressionProcess.on('error', (error) => {
    console.error('Compression process error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

//Uruchamia serwer na określonym porcie i loguje informację o jego uruchomieniu.
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
