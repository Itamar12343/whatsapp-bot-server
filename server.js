const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const io = require("socket.io")(3000, {
    cors: {
        origin: "*"
    }
});
let qrToSend = null;
const number = "+972587587286";
const chatId = number.substring(1) + "@c.us";
let text = "hello";

io.on("connection", socket => {
    const client = new Client();
    client.initialize();

    socket.on("get_qr_code", () => {
        if (qrToSend !== null) {
            socket.emit("qr_code", qrToSend);
        }
    });

    client.on('qr', (qr) => {
        //console.log('QR RECEIVED', qr);
        //qrcode.generate(qr, { small: true });
        qrToSend = qr;
        socket.emit("qr_code", qrToSend);
    });

    client.on('ready', () => {
        //console.log('Client is ready!');
        socket.emit("loged in");
        client.sendMessage(chatId, text);
    });

    client.on("disconnected", () => {
        socket.emit("client_disconnected");
    })

});


/*client.on('message', message => {
    //console.log(message.body);
});*/