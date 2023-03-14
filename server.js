const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const io = require("socket.io")(3000, {
    cors: {
        origin: "*"
    }
});

const number = "+972587587288";
const chatId = number.substring(1) + "@c.us";
let text = "hello";

client.on('qr', (qr) => {
    //console.log('QR RECEIVED', qr);
    //qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');

    client.sendMessage(chatId, text);
});

client.on('message', message => {
    console.log(message.body);
});

client.initialize();