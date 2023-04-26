module.exports = app => {
  const path = require('path');
  const sessionHistories = require(path.join(__dirname, '..', 'controllers', 'session.controller.js'));

  var router = require("express").Router();

  // Create a new Session
  router.post("/", sessionHistories.create);

  // Retrieve all Sessions
  router.get("/", sessionHistories.findAll);

  // Retrieve a single Session with session_id
  router.get("/:session_id", sessionHistories.findOne);

  // Update a Session with session_id
  router.put("/:session_id", sessionHistories.update);

  // Delete a Session with session_id
  router.delete("/:session_id", sessionHistories.delete);


  app.use('/api/session-histories', router);
};