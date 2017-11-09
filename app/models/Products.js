// Including mongoose model //
var mongoose = require('mongoose');
// Storing mongoose schema in a variable //
var Schema = mongoose.Schema;

// Creating a new mongoose schema //
var productSchema = new Schema({
    productId              :  {type:String,default:'',required:true}, // Product's ID //
    productName            :  {type:String,default:'',required:true}, // Product's Name //
    productPrice           :  {type:String,default:'',required:true}, // Product's Price //
    productDescription     :  {type:String,default:'',required:true}, // Product's Description //
    productSpecifications  :  {}, // An object to store product's specifications //
    productSeller          :  {}, // Product's seller object //
    productImages          :  [], // An array to store product images //
    productCategory        :  []  // Product categories array //

});

// Creating a mongoose model from the above schema //
mongoose.model('Product',productSchema);
