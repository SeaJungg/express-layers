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

router.route('/sessions/:session_id/apply')
  .post(makeExpressCallback(sessionController.applySession));

router.route('/sessions/:session_id/attendees/:user_id')
  .put(makeExpressCallback(sessionController.recordAttendance));

router.route('/sessions/:session_id/supporters/:user_id')
  .put(makeExpressCallback(sessionController.applyDailySupporter));

module.exports = router;