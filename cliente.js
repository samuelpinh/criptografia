const net = require('net');
const readline = require('readline');
const { criptografar, decifrar } = require('./cripto');

const PORTA = 3000;
const HOST = '127.0.0.1';

// cores ANSI para deixar o terminal mais visual
const VERDE = '\x1b[32m';
const CIANO = '\x1b[36m';
const VERMELHO = '\x1b[31m';
const RESET = '\x1b[0m';

const socket = net.createConnection({ port:PORTA, host:HOST }, () => {
    console.log(`${VERDE} Conectado com sucesso ao servidor !${RESET}`);
    console.log('Escreva sua mensagem e pressione ENTER:\n');
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// captura as mensagens digitadas no terminal e envia 
rl.on('line', (linha) => {
    if (linha.trim().length === 0) return;

    try {
        const pacoteCifrado = criptografar(linha);
        socket.write(pacoteCifrado);
    } catch (err) {
        console.log(`${VERMELHO}Erro ao criptografar mensagem.${RESET}`);
    }
});

// recebe pacotes cifrados do servidor e decifra 
socket.on('data', (data) => {
    try {
        const mensagemDecifrada = decifrar(data.toString());
        console.log(`\n${CIANO}[Mensagem Recebida]:${RESET} ${mensagemDecifrada}`);
    } catch (err) {
        console.log(`\n${VERMELHO}[Erro]: Falha ao decifrar o pacote recebido.${RESET}`);
    }
});

socket.on('end', () => {
    console.log(`\n${VERMELHO}Conexão encerrada pelo servidor.${RESET}`);
    process.exit(0);
}); 

socket.on('error', (err) => {
    console.log(`\n${VERMELHO}Erro de conexão:${RESET} ${err.message}`);
    process.exit(1);
});