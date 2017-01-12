import app from './config/express'

let server = app.listen(3000, '0.0.0.0', function () {
  let host = server.address().address
  host = (host === '::' ? 'localhost' : host)
  let port = server.address().port

  console.log('[API] listening at http://%s:%s', host, port)
})

export default app
