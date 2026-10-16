const { WebSocketServer } = require('ws');

const PORTA = 3000;
const wss = new WebSocketServer({ port: PORTA });
const clientes = new Set();

wss.on('connection', (ws) => {
  clientes.add(ws);
  console.log('[+] Cliente conectado via WebSocket');

  ws.on('message', (data) => {
    // Repassa a mensagem cifrada para todos os outros clientes
    for (const cliente of clientes) {
      if (cliente !== ws && cliente.readyState === 1) { // 1 = OPEN
        cliente.send(data.toString());
      }
    }
  });

  ws.on('close', () => {
    clientes.delete(ws);
    console.log('[-] Cliente desconectado');
  });
});

console.log(`Servidor WebSocket rodando na porta ${PORTA}`);