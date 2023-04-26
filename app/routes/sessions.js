const express = require('express');
const sessionController = require('../controllers/session.controller.js');
const makeExpressCallback = require('./makeCallback.js');

const router = express.Router();

router.route('/sessions')
  .post(makeExpressCallback(sessionController.postSession));

router.route('/sessions')
  .get(makeExpressCallback(sessionController.getSessionsByAttribute));

router.route('/sessions/:session_id')
  .get(makeExpressCallback(sessionController.getSessionDetail));

module.exports = router;