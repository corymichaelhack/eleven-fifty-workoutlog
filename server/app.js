require('dotenv').config(); //to help hide our token signatures
let express = require('express');
let app = express();
let user = require('./controllers/usercontroller');
let log = require('./controllers/logcontroller');

let sequelize = require('./db');
sequelize.sync(); //tip pass in {force:true} for resetting all tables

//APP USE
app.use(express.json())// to use the req.body middleware
app.use(require('./middleware/headers'));

// EXPOSED ROUTES
app.use('/api', user); //call user routes

// PROTECTED ROUTES
app.use(require('./middleware/validate-session'));
app.use('/api', log); //call log routes

app.listen(3000, function(){
    console.log('App is listening on port 3000');
});




