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
    function register (ws, req) {
      ws.peerId = req.peerId
      ws.seeds = []
    }

    function seeding (ws, req) {
      if (ws.peerId === undefined) {
        ws.close()
        return
      }
      console.log('seeding')
      addSeeder(req.hashInfo, ws.peerId)
      ws.seeds.push(req.hashInfo)
    }

    function remove (ws, req) {
      ws.seeds = ws.seeds.filter(function (i) {
        return i !== req.hashInfo
      })
      removeSeeder(req.hashInfo, ws.peerId)
    }

    try {
      const req = JSON.parse(message)

      switch (req.endpoint) {
        case 'register':
          register(ws, req)
          break
        case 'seeding':
          seeding(ws, req)
          break
        case 'remove':
          remove(ws, req)
          break
        default:
          console.log('not such endpoint:' + req.endpoint)
          ws.close()
      }

      console.log('received: %s', req)
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

export { seedList }
