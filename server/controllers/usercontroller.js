let express = require('express');
let router = express.Router();
let sequelize = require('../db');
let UserModel = sequelize.import('../models/user');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

//NEW USER ROUTE
router.post('/createuser', function(req, res){

    //set variables to the requested elements in the body that step into the names of the database
    // let new varibale name = call middleware body(req.body).call model name(username)
    let newUserName = req.body.username;
    let newUserPassword = req.body.password;

    UserModel
    .create({
        username: newUserName,
        //Use bcrypt to hash our password and encode it
        password: bcrypt.hashSync(newUserPassword, 13)
    }).then( 
        function createSuccess(userOf){
            //set variable that equals a new session token with .sign and the required payload and signature, plus any specific options or callbacks
            let token = jwt.sign({id: userOf.id}, process.env.JWT_SECRET, {expiresIn: "1d"});
            //pass the value token back into our response
            res.json({
                user: userOf,
                message: 'created',
                sessionToken: token
            });
        },
        //set promise to make sure response comes after the insert of data into database
        function message(usernameReturned, passwordReturned){
            //returnedData uses the message function and returns the data from the promise
            res.json({
                //return our data from the parameters provided
                username: usernameReturned,
                password: passwordReturned
            });
            },
            //handle errors
            function createError(err) {
                res.send(500, err.message);
            }
        );
});


//LOGIN ROUTE
router.post('/login', function(req, res){
    //fins one user from the database where the username is the same as the request username in the body
    UserModel.findOne( {where: {username: req.body.username} }).then(
        //Promise
        function(userOf){
            //if there is a user return the user data as json
            if(userOf) {
                //use bcrypt to compare the supplied password to the user.password in the database
                bcrypt.compare(req.body.password, userOf.password, function(err, match){
                    if (match){
                        let token = jwt.sign({id: userOf.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        res.json({
                            user: userOf,
                            message: 'Successful authenticated login',
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "token match has failed, invalid password"})
                    }
                })
            } else {
                //if not return an error 
                res.status(500).send({error: "It failed. Did not find user"});
            }
        },
        function(err){
            res.status(501).send({error: "failed to login, uncertain error"});
        }
    );
});


module.exports = router;