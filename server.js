const WebSocket = require('ws');
const http = require('http');

// Render дає порт через env
const PORT = process.env.PORT || 3000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let timer = 20;

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// таймер
setInterval(() => {
    timer--;

    broadcast({ type: 'timer', value: timer });

    if (timer <= 0) {
        const result = Math.floor(Math.random() * 37);

        broadcast({ type: 'result', value: result });

        timer = 20;
    }

}, 1000);

// чат
wss.on('connection', ws => {
    ws.on('message', message => {
        let data;

        try {
            data = JSON.parse(message);
        } catch {
            return;
        }

        if (data.type === 'chat') {
            broadcast({
                type: 'chat',
                message: data.message
            });
        }
    });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
