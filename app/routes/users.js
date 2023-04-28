const express = require('express');
const userController = require('../controllers/user.controller.js');
const makeExpressCallback = require('./makeCallback.js');

const router = express.Router();

router.route('/kakao/code').get(makeExpressCallback(userController.getKakaoUserBeforeLogin));

router.route('/signin').post(makeExpressCallback(userController.signIn));

router.route('/signup').post(makeExpressCallback(userController.signUp));

module.exports = router;