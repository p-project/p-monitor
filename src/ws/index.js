import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 7894 })
console.log('[ws] listening at 7894')

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
  })

  ws.send('something')
})
