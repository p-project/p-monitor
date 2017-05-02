import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 7894, clientTracking: true })
console.log('[ws] listening at 7894')

const seedList = new Map()

function addSeeder (hashInfo, peerId) {
  let seederList = seedList[hashInfo]
  if (seederList) {
    seederList = seederList.filter(function (i) {
      return i !== peerId
    })
    seederList.push(peerId)
    seedList[hashInfo] = seederList
  } else {
    seedList[hashInfo] = [peerId]
  }
}

function removeSeeder (hashInfo, peerId) {
  let seederList = seedList[hashInfo]
  if (seederList) {
    seederList = seederList.filter(function (i) {
      return i !== peerId
    })
    if (seederList.length === 0) {
      seedList.delete(hashInfo)
    } else {
      seedList[hashInfo] = seederList
    }
  }
}

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    try {
      const req = JSON.parse(message)

      switch (req.endpoint) {
        case 'register':
          ws.peerId = req.peerId
          ws.seeds = []
          break
        case 'seeding':
          if (ws.peerId === undefined) {
            ws.close()
            break
          }
          console.log('seeding')
          addSeeder(message.hashInfo, ws.peerId)
          ws.seeds.push(message.hashInfo)
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
    ws.seeds.forEach((hashInfo) => {
      removeSeeder(hashInfo, ws.peerId)
    })
  })
})
