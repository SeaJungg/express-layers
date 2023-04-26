const db = require("../database/models/index");

const User = db.User;
//const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.findAll()
      .then( users => {
          res.status(200).send(JSON.stringify(users));
      })
      .catch( err => {
          res.status(500).send(JSON.stringify(err));
      });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const user_id = req.params.user_id;
  User.findByPk(user_id)
  .then( user => {
      res.status(200).send(JSON.stringify(user));
  })
  .catch( err => {
      res.status(500).send(JSON.stringify(err));
  });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const user_id = req.params.user_id;
  User.destroy({
    where: {
        user_id: user_id
    }
    })
    .then( () => {
        res.status(200).send();
    })
    .catch( err => {
        res.status(500).send(JSON.stringify(err));
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published Users
exports.findAllPublished = (req, res) => {
  
};


