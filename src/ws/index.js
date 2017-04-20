import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 7894, clientTracking: true })
console.log('[ws] listening at 7894')

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    try {
      const req = JSON.parse(message)

      switch (req.endpoint) {
        case 'register':
          ws.peerId = req.peerId
          break
        case 'seeding':
          if (ws.peerId === undefined) {
            ws.close()
          }
          console.log('seeding')
          break
        default:
          console.log('not such endpoint:' + message.endpoint)
          ws.close()
      }

      console.log('received: %s', message)
    } catch (e) {
      ws.close()
    }
  })

  ws.on('close', function incoming (message) {
    console.log('closed')
  })

  ws.send('something')
})
