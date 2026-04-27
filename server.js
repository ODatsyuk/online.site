const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

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
});
