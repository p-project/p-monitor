import test from 'ava'
import WebSocket from 'ws'

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

test('SeedList should be filled', async t => {
  const seedList = require('../ws').seedList

  let ws = new WebSocket('ws://localhost:7894', {
    perMessageDeflate: false
  })

  const peerId = 'peerIdString'
  const hashInfo = 'hashInfoString'

  ws.on('open', function () {
    ws.send(JSON.stringify({endpoint: 'register', peerId}))
    ws.send(JSON.stringify({endpoint: 'seeding', hashInfo}))
  })

  await sleep(1000)

  t.true(seedList[hashInfo].length === 1, hashInfo + ' has 1 seeder')
  t.true(seedList[hashInfo][0] === peerId, 'the seeder is ' + peerId)
})
