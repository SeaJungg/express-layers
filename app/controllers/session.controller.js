const db = require("../database/models/index");

const Session = db.Session;
const Op = db.Sequelize.Op;

// Create and Save a new Session
exports.create = (req, res) => {
    const session = {
        session_id: req.body.session_id,
        imageUrl: req.body.imageUrl,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        user_id: req.body.user_id,
        launch_date: req.body.launch_date,
        application_fee: req.body.application_fee,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    }

    Session.create(session)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        })
};

// Retrieve all Sessions from the database.
exports.findAll = (req, res) => {
    var condition = req.body.title ? { title: { [Op.like]: `%${req.body.title}%` } } : null;

    Session.findAll({ where: condition })
        .then(sessions => {
            res.status(200).send(JSON.stringify(sessions));
        })
        .catch(err => {
            res.status(500).send(JSON.stringify(err));
        });
};

// Find a single Session with an id
exports.findOne = (req, res) => {
    const session_id = req.body.session_id;
    Session.findByPk(session_id)
        .then(session => {
            res.status(200).send(JSON.stringify(session));
        })
        .catch(err => {
            res.status(500).send(JSON.stringify(err));
        });
};

// Update a Session by the id in the request
exports.update = (req, res) => {

};

// Delete a Session with the specified id in the request
exports.delete = (req, res) => {
    const session_id = req.body.session_id;
    Session.destroy({
        where: {
            session_id: session_id
        }
    })
        .then(() => {
            res.status(200).send();
        })
        .catch(err => {
            res.status(500).send(JSON.stringify(err));
        });
};
/*
exports.createSessionAndHistory = async (req, res) => {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
  
      const createdSession = await db.Session.create(
        {
            session_id: req.body.session_id,
            imageUrl: req.body.imageUrl,
            name: req.body.name,
            description: req.body.description,
            location: req.body.location,
            user_id: req.body.user_id,
            launch_date: req.body.launch_date,
            application_fee: req.body.application_fee,
            created_at: req.body.created_at,
            updated_at: req.body.updated_at
        },
        { transaction }
      );
  
      const sessionHistoryData = {
        user_id: user_id,
        session_id: createdSession.session_id,
        action: "created",
      };
  
      await db.SessionHistory.create(sessionHistoryData, { transaction });
  
      await transaction.commit();
  
      return createdSession;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  };  

  */