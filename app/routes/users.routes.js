var express = require('express');
var router = express.Router();
var db = require('../database/models/index');

router.get("/", (req, res) => {
    return res.send('hi')
})
router.get("/all", function(req, res) {
    console.log(req.method, req.baseUrl)
    db.User.findAll()
        .then( users => {
            res.status(200).send(JSON.stringify(users));
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

router.get("/:id", function(req, res) {
    console.log(req.method, req.baseUrl)
    db.User.findByPk(req.params.id)
        .then( user => {
            res.status(200).send(JSON.stringify(user));
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

router.delete("/:id", function(req, res) {
    console.log(req.method, req.baseUrl)
    db.User.destroy({
        where: {
            user_id: req.params.id
        }
        })
        .then( () => {
            res.status(200).send();
        })
        .catch( err => {
            res.status(500).send(JSON.stringify(err));
        });
});

module.exports = router;