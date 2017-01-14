import express from 'express'
import validate from 'express-validation'

import * as torrentCtrl from '../controllers/torrent.controller'

const router = express.Router()

/** POST /api/getSeedTorrent - Returns the torrent hashInfo to seed */
router.route('/getSeedTorrent')
  .post(validate({}), torrentCtrl.getSeedTorrent)

export default router
