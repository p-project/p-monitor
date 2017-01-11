import express from 'express';

const router = express.Router();

router.get('/lul', function (req, res, next) {
  console.log('kek')
  res.send({ ok: 'lul' })
});


export default router;
