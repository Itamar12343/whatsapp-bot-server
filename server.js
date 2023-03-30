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
        if (msg.timeType === "seconds") {
            let timeOut = Number(msg.time) * 1000;
            //console.log(timeOut);
            schedule(timeOut, msg);
        }
        if (msg.timeType === "minutes") {
            let timeOut = Number(msg.time) * 60 * 1000;
            //console.log(timeOut);
            schedule(timeOut, msg);
        }
        if (msg.timeType === "hours") {
            let timeOut = Number(msg.time) * 60 * 60 * 1000;
            //console.log(timeOut);
            schedule(timeOut, msg);
        }

    }
    //checkTime({ time: 6, timeType: "seconds" });

    function schedule(timeOut, msg) {
        let cancel = false;
        setTimeout(() => {
            let number = msg.number;
            let chatId = number.substring(1) + "@c.us";
            let text = msg.text;
            if (cancel === false) {
                client.sendMessage(chatId, text);
                console.log("send");
            }
        }, timeOut);
    }
}

/*client.on('message', message => {
    //console.log(message.body);
});*/