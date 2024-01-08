//  Importuje moduł fs (file system), który dostarcza funkcje do operacji na systemie plików.
const fs = require('fs');
// Importuje moduł archiver, który umożliwia tworzenie archiwów.
const archiver = require('archiver');

// Pobiera ścieżkę katalogu z argumentów linii poleceń.
const directory = process.argv[2];

// Sprawdza, czy ścieżka katalogu została przekazana jako argument. Jeśli nie, wypisuje błąd i kończy działanie.
if (!directory) {
  console.error('Missing directory parameter');
  process.exit(1);
}

// Create output stream for the archive
// Tworzy strumień wyjściowy dla archiwum o nazwie katalogu z rozszerzeniem .zip.
const output = fs.createWriteStream(`${directory}.zip`);
// Tworzy obiekt archiwum zip z ustawieniem maksymalnego poziomu kompresji.
const archive = archiver('zip', { zlib: { level: 9 } });

// Pipe archive data to the output file
// Przekierowuje dane archiwum do strumienia wyjściowego.
archive.pipe(output);

// Append all files and directories in the given directory to the archive
// Dodaje do archiwum wszystkie pliki i katalogi z podanego katalogu.
archive.directory(directory, false);

// Finalize the archive and close the output stream
// Finalizuje proces tworzenia archiwum.
archive.finalize();

// Listen for the 'close' event of the output stream
// Nasłuchuje na zdarzenie zakończenia strumienia wyjściowego, czyli zakończenia tworzenia archiwum.
output.on('close', () => {
  // Send a message backto the parent process with the path of the created archive
  // Wysyła nazwę utworzonego archiwum do procesu nadrzędnego.
  process.send(`${directory}.zip`);
  // Exit the child process
  // Kończy działanie procesu potomnego z kodem 0 (brak błędów).
  process.exit(0);
});

// Handle errors during compression
// Nasłuchuje na zdarzenie błędu podczas procesu kompresji i obsługuje go w razie potrzeby.
archive.on('error', (err) => {
  console.error('Compression error:', err);
  process.exit(1);
});
