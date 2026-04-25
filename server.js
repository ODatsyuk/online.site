const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let timer = 20;

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// таймер (кожну секунду)
setInterval(() => {
    timer--;

    broadcast({
        type: 'timer',
        value: timer
    });

    if (timer <= 0) {
        let result = Math.floor(Math.random() * 37);

        broadcast({
            type: 'result',
            value: result
        });

        timer = 20;
    }

}, 1000);

// підключення
wss.on('connection', (ws) => {

    ws.on('message', (message) => {
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

console.log("✅ Сервер запущений на ws://localhost:3000");
