const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Server працює");
});

const wss = new WebSocket.Server({ server });

let timer = 20;

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function spin() {
    return Math.floor(Math.random() * 37);
}

setInterval(() => {
    timer--;

    broadcast({ type: 'timer', value: timer });

    if (timer <= 0) {
        const result = spin();
        broadcast({ type: 'result', value: result });
        timer = 20;
    }

}, 1000);

wss.on('connection', ws => {

    ws.send(JSON.stringify({ type: 'timer', value: timer }));

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'chat') {
                broadcast({
                    type: 'chat',
                    text: data.text
                });
            }

        } catch(e) {}
    });

});

server.listen(port, () => {
    console.log("Server запущено");
});

process.on('uncaughtException', console.error);
