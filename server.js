const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log("Сервер запущено: ws://localhost:8080");

function spin() {
    return Math.floor(Math.random() * 37);
}

wss.on('connection', function(ws) {

    ws.on('message', function(msg) {
        if (msg.toString() === 'spin') {
            const result = spin();

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(result.toString());
                }
            });
        }
    });

});