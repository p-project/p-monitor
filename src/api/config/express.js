import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'

import routes from '../routes/index.route'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.enable('trust proxy')

app.use('/api', routes)
app.use(helmet())

export default app
