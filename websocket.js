module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error('WS error:', err.message)
            return
        }
        data.sender = null
        if(req.session && req.session.passport && req.session.passport.user)
            data.sender = req.session.passport.user
        data.timestamp = new Date()
        console.log('WS data:', data)
        wsInstance.getWss().clients.forEach(client => {
            client.send(JSON.stringify(data))
        })
    })
}