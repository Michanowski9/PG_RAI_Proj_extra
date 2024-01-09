const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

server.on('connection', (socket) => {
  console.log('Nowe połączenie WebSocket.');

  // Nasłuchuj wiadomości od klienta
  socket.on('message', (message) => {
    console.log(`Otrzymano wiadomość: ${message}`);

    // Odpowiedz na wiadomość od klienta
    socket.send(`Odpowiedź od serwera: ${message}`);
  });

  // Wyślij przywitalną wiadomość do klienta po nawiązaniu połączenia
  socket.send('Witaj na serwerze WebSocket!');
});
