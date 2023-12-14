module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error('WS error:', err.message)
            return
        }
        data.timestamp = new Date()
        console.log('WS data:', data)
        wsInstance.getWss().clients.forEach(client => {
            client.send(JSON.stringify(data))
        })
    })
}