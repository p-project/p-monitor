var TrackerServer = require('bittorrent-tracker').Server

var trackerServer = new TrackerServer({
  udp: true, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true // enable web-based statistics? [default=true]
})

trackerServer.on('error', function (err) {
  // fatal server error!
  console.log(err.message)
})

trackerServer.on('warning', function (err) {
  // client sent bad data. probably not a problem, just a buggy client.
  console.log(err.message)
})

trackerServer.on('listening', function () {
  // fired when all requested servers are listening
  console.log('[Tracker] listening on http port:' + trackerServer.http.address().port)
  console.log('[Tracker] listening on udp port:' + trackerServer.udp.address().port)
})

// start tracker server listening! Use 0 to listen on a random free port.
trackerServer.listen(8000, 'localhost')

// listen for individual tracker messages from peers:

trackerServer.on('start', function (addr) {
  console.log('[Tracker] got start message from ' + addr)
  console.log(Object.keys(trackerServer.torrents))
})

trackerServer.on('complete', function (addr) {
  console.log('[Tracker] got complete message from ' + addr)
  console.log(Object.keys(trackerServer.torrents))
})

trackerServer.on('update', function (addr) {
  console.log('[Tracker] got update message from ' + addr)
  console.log(Object.keys(trackerServer.torrents))
})
trackerServer.on('stop', function (addr) {
  console.log('[Tracker] got stop message from ' + addr)
  console.log(Object.keys(trackerServer.torrents))
})
