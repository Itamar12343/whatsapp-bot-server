const { Client } = require('whatsapp-web.js');
const io = require("socket.io")(3000, {
    cors: {
        origin: "*"
    }
});
let qrToSend = null;
//let number = "+972587587286";
//let chatId = number.substring(1) + "@c.us";
//let text = "hello";

io.on("connection", socket => {
    session(socket);
});

function session(socket) {
    const client = new Client();
    client.initialize();
    let isconnected = false;

    socket.on("get_qr_code", () => {
        if (qrToSend !== null) {
            socket.emit("qr_code", qrToSend);
        }
    });

    socket.on("the client disconnected", () => {
        if (isconnected === true) {
            client.logout();
        }
    });

    socket.on("schedule_msg", msg => {
        checkTime(msg);
    });

    client.on('qr', (qr) => {
        qrToSend = qr;
        socket.emit("qr_code", qrToSend);
    });

    client.on('ready', () => {
        //console.log('Client is ready!');
        socket.emit("loged in");
        isconnected = true;
        //client.sendMessage(chatId, text);
    });

    client.on("disconnected", () => {
        socket.emit("client_disconnected");
    });


    function checkTime(msg) {
        setInterval(() => {
            let today = new Date();
            let hour = today.getHours();
            let minute = today.getMinutes();
            let time = hour + ":" + minute;
            console.log(time);
            console.log(msg.time);
            if (time == msg.time) {
                let number = msg.number;
                let chatId = number.substring(1) + "@c.us";
                let text = msg.text;
                client.sendMessage(chatId, text);
            }
        }, 1000);
    }
}

/*client.on('message', message => {
    //console.log(message.body);
});*/