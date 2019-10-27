var jwt = require('jsonwebtoken');
var sequelize = require('../db');
var User = sequelize.import('../models/user');

module.exports = function(req, res, next){
    if (req.method == 'OPTIONS'){
        next();
    } else {
        //1 declare variable to hold token which is pulled form the authorization header of the request coming in
        var sessionToken = req.headers.authorization;
        //2 print token to console for confirmation - not secure for final code
        console.log(sessionToken)
        //3 if no token is present return an error
        if (!sessionToken) return res.status(403).send({auth: false, message: 'No token provided.'});
        else {
            //4 because no user is sent only tokens will be checked
            //5 use verify to decode token with env secret
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded){
                    //6 if decoded returns a value look through database for id and users table info passed to callback
                    User.findOne({where: { id: decoded.id}}).then(user => {
                    //7 this callback sets user value as the id value
                    req.user = user;
                    next();
                },
                    function(){
                        //8 send error
                    res.status(401).send({error: 'Not authorized'});
                });
                } else {
                    //9 send error
                    res.status(400).send({error: 'Not authorized'});
                }
            });
        }
    }
}
