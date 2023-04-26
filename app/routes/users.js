module.exports = app => {
  const path = require('path');
  const users = require(path.join(__dirname, '..', 'controllers', 'user.controller.js'));

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all published Users
  router.get("/published", users.findAllPublished);

  // Retrieve a single User with user_id
  router.get("/:user_id", users.findOne);

  // Update a User with user_id
  router.put("/:user_id", users.update);

  // Delete a User with user_id
  router.delete("/:user_id", users.delete);

  // Delete all Users
  router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};