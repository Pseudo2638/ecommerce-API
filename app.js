// Including express module and intitalizing it as a function in 'app' variable //
var express = require('express');
var app = express();
// Incluing mongoose, body-parser, cookie-parser, express-session, morgan and path middlewares //
var mongoose = require('mongoose'); // For database schemas //
var bodyParser = require('body-parser'); // For passing and accepting data from the body of the webpage //
var cookieParser = require('cookie-parser'); // For maintaining user data when user logs in or logout // 
var session = require('express-session');  // Giving/checking authorization to allow only identified users to make changes //
var logger = require('morgan'); // This is used to log all the request which are made on your API //
var path = require('path'); // Path is used to link directories inside the application //

// Intitalizing the middlewares using '.use' //
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(cookieParser());
app.use(session({
     name : "user_data_cookie", // Name of the cookie by which it is stored on the browser //
     secret : "myAppSecret",
     httpOnly : true,
     saveUninitialized : true,
     cookie : {secure : false} // Make true in case of SSL .
}));

app.set('view engine','jade'); // Intitializing jade templating engine //
app.set('views',path.join(__dirname + '/app/views')); // Including the views directory dynamically //

// Database path //
var dbPath = "mongodb://localhost/eCommerce";
// Making connetion with the database //
var db = mongoose.connect(dbPath);

// Opening the connection to the database //
mongoose.connection.once('open',function(){
    //mongoose.connection.db.dropDatabase();
     console.log("Connection to eCommerce database is successfull.");
});

// Including fs middleware which is used to add the directories for MVC dynamically to the program so that it could be referenced later inside the app //
var fs = require('fs');

// It is a kind of a middleware which is basically used to sync the folders/directories for MVC with our application //
// For Models Directory //
fs.readdirSync('./app/models').forEach(function(file){
     if(file.indexOf('.js')){
        require('./app/models/'+file);
     }
});

// For controllers directory //
fs.readdirSync('./app/controllers').forEach(function(file){
     if(file.indexOf('.js')){
        var route = require('./app/controllers/'+file);
        route.controllerFunction(app);
     }
});

// This is a custom middleware //
// We create custom middlwares to ease our tasks beacuse , //
// We declare functions that need to be used at many places throughout our application //
// Below middleware has been created to serve the purpose of checking whether the user requesting for data is legit user or not //
var auth = require('./middlewares/auth');

// Calling User model from the user schema //
var userModel = mongoose.model('User');

// Using/Initializing our custom middleware //
app.use(function(req,res,next){
     // If user is logged in or user's session is existing //
     if(req.session && req.session.user)
     {
      // Check if email id of user matches with the email id of the current user requesting to log in //
       userModel.findOne({'email':req.session.user.email},function(err,user){
           // If success //
           if(user)
           {
             // remove the user's password from the session cookie for security purposes //
             req.user = user;
             delete req.user.password;
             req.session.user = user;
             next();
           }
           else
           {
             // Do nothing //
           }
       });
     }
     else
     {
        // Execute the next function or command //
        next();
     }
});

// 404 stands for 'status: not found' //
// So, if a user enter a wrong url, this function would get executed //
app.get('*',function(req,res,next){
  // Here, req is : request and res: is response //
  // Responce is send data to the browser and Request is used to get data //

   // Send response to the user //
   res.status = 404;

   // next() is an callback function  //
   // It is used to call an other function or display any message //
   // Callback function main concept is to not wait for above functions to execute, rather make them call at places we want //
   // Generally in this case used to throw an display error message to the user //
   next('You have mistyped the url. Please check.');
});

// This is an error handling middleware //
// This would take data error status from the above function using 'err' and alter the error message by display our custom message //
app.use(function(err,req,res,next){

   // Show message in the terminal (For developer's reference) //
   console.log('Our custom error handler was used !');
   // If the error status passed is 404 ie: url not found //
   if(res.status==404)
   {
    // Send response to the user //
    res.send('Oops ! I think you have landed on an wrong section section of the website. Please redirect to homepage.');
   }
   else
   {
    // Send error as response to the user //
    res.send(err);
   }
});

// App will listen on this port number //
// For example if local host : http://localhost:2000 //
// if, domain : https://xyz.com:2000  //
app.listen(2000,function(){

    // For developers reference to check if the app is active or not //
    console.log('Our app is now active on port 2000 ! Booyah !!');

});
