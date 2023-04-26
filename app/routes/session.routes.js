module.exports = app => {
  const path = require('path');
  const sessions = require(path.join(__dirname, '..', 'controllers', 'session.controller.js'));

  var router = require("express").Router();

  // Create a new Session
  router.post("/", sessions.create);

  // Retrieve all Sessions
  router.get("/", sessions.findAll);

  // Retrieve a single Session with session_id
  router.get("/:session_id", sessions.findOne);

  // Update a Session with session_id
  router.put("/:session_id", sessions.update);

  // Delete a Session with session_id
  router.delete("/:session_id", sessions.delete);

  //router.post("/:session_id/checkin", sessions.chechIn);
  
  // Delete all Sessions
  //router.delete("/", sessions.deleteAll);

  app.use('/api/sessions', router);
};