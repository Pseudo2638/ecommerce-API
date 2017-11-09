// Including mongoose model //
var mongoose = require('mongoose');
// Storing mongoose schema in a variable //
var Schema = mongoose.Schema;

// Creating a new mongoose schema //
var userSchema = new Schema({
	userId          : {type:String,default:'',required:true}, // User's ID //
    firstName       : {type:String,default:'',required:true}, // User's First Name //
    lastName        : {type:String,default:'',required:true}, // User's Last Name //
    email           : {type:String,default:'',required:true}, // User's Email //
    password        : {type:String,default:'',required:true}, // User's Password //
    mobileNumbers   : {},  // User's mobile numbers //
    recoveryDetails : {},  // User's recovery details //
    walletInfo      : {},  // This will be an object for creating user's wallet //
    savedAddress    : {},  // This will be array for storing the saved address by the user //
    savedCards      : {},  // This will be array for storing the saved bank cards by the user //
    cart            : {}   // Shopping cart array of user //
});

// Creating a mongoose model from the above schema //
mongoose.model('User',userSchema);
