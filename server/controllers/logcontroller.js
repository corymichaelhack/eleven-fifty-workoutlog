var router = require('express').Router();
var sequelize = require('../db');
var UserModel = sequelize.import('../models/user');
var LogModel = sequelize.import('../models/log');

//CREATE LOG
router.post('/createlog', function(req, res){
    // res.send("This is the createlog endpoint")
    let newOwner = req.user.id;
    let newDescription = req.body.description;
    let newDefinition = req.body.definition;
    let newResult = req.body.result;
    

    LogModel
    .create({
        owner: newOwner,
        description: newDescription,
        definition: newDefinition,
        result: newResult
        
        
    })
    .then(
        function createSuccess(descriptionReturned, definitionReturned, resultReturned, ownerReturned) {
            res.json({
                description: descriptionReturned,
                definition: definitionReturned,
                result: resultReturned,
                owner: ownerReturned
            });
        },
        function createError(err) {
            res.send(500, err.message);
        }
    );
});

//GET ALL LOGS FOR INDIVIDUAL USER
router.get('/getalllogs', function(req, res){
    // test end point
        // res.send("This is the get all logs for user")

    var userid = req.user.id;
    console.log(userid);

    LogModel
    .findAll({
        where: { owner: userid }
    })
    .then(
        function findAllSuccess(data) {
            res.json(data);
        },
        function findAllError(err){
            res.send(500, err.message);
        }
    );
});

//GET INDIVIDUAL LOG by ID FOR INDIVIDUAL USER
router.get('/:id', function(req, res){
    // test end point
        //res.send("This is the get individual log of individual user")
    
   var data = req.params.id;
   var userid = req.user.id;

    LogModel
        .findOne({
            where: { id: data, owner: userid }
        }).then(
            function findOneSuccess(data) {
                res.json(data);
            },
            function findOneError(err) {
                res.send(500, err.message);
            }
        );
});

//PUT/UPDATE INDIVIDUAL LOG by ID FOR INDIVIDUAL USER
router.put('/:id', function(req, res){
    // test end point
        // res.send("This is the update individual log of individual user")
    
    
    let data = req.params.id;
    let updatedDescription = req.body.description
    let updatedDefinition = req.body.definition
    let updatedResult = req.body.result

    LogModel
        .update({
            description: updatedDescription,
            definition: updatedDefinition,
            result: updatedResult
        },
        {where: {id: data}}
        ).then(
            function updateSuccess(updatedLog){
                res.json({
                    description: updatedDescription,
                    definition: updatedDefinition,
                    result: updatedResult
                });
            },
            function updateError(err){
                res.send(500, err.message);
            }
        )
});

//DELETE INDIVIDUAL LOG by ID FOR INDIVIDUAL USER
router.delete('/:id', function(req, res){
    // res.send("This is the delete individual log of individual user")

    var data = req.params.id;
    var userid = req.user.id;

    LogModel
    .destroy({
        where: { id: data, owner: userid }
    }).then(
        function deleteLogSuccess(data){
            res.send("you removed a log");
        },
        function deleteLogError(err){
            res.send(500, err.message);
        }
    );
});

module.exports = router;