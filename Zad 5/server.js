const WebSocket = require('ws'); //  Importuje bibliotekę ws, która umożliwia obsługę WebSocket na serwerze.
const server = new WebSocket.Server({ port: 3000 }); // Tworzy serwer WebSocket nasłuchujący na porcie 3000.

server.on('connection', (socket) => { // Nasłuchuje na zdarzenie nawiązania nowego połączenia i wykonuje funkcję zwrotną, która otrzymuje obiekt reprezentujący to połączenie (socket).
  console.log('Nowe połączenie WebSocket.');

  // Nasłuchuj wiadomości od klienta
  socket.on('message', (message) => { // Nasłuchuje na zdarzenie otrzymania wiadomości od klienta i wykonuje funkcję zwrotną, która wypisuje wiadomość na konsoli i wysyła odpowiedź do klienta.
    console.log(`Otrzymano wiadomość: ${message}`);

    // Odpowiedz na wiadomość od klienta
    socket.send(`Odpowiedź od serwera: ${message}`);
  });

  // Wyślij przywitalną wiadomość do klienta po nawiązaniu połączenia
  socket.send('Witaj na serwerze WebSocket!'); // Wysyła przywitalną wiadomość do klienta po nawiązaniu połączenia.
});
