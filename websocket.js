module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        wsInstance.getWss().clients.forEach(client => {
            client.send(rawData.toUpperCase())
        })
    })
}