// Including express, mongoose and uniqid modules //
var express = require('express'); // Simplified node.js //
var mongoose = require('mongoose'); // Database //
var uniqid = require('uniqid');  // For generating unique id for specific purposes //

// Inititalizing express router for creating routes for the API in a variable //
var productsRouter = express.Router();

// Calling User model from the user schema //
var userModel = mongoose.model('User');
// Calling Product model from the product schema //
var productsModel = mongoose.model('Product');

// This is an library file which generates response format for all API's accordingly //
var responseGenerator = require('./../../libs/responseGenerator');

// Here, 'exports' is used so that other files and functions can also call this function throughout the app //
module.exports.controllerFunction = function(app){

  // Create Screen //
  // 'GET' http method //
  productsRouter.get('/create/screen',function(req,res){
      // Displays addProduct.jade //
      // It is a jade templating engine document which is used to create html data //
      res.render('addProduct');
  });

  // Delete Screen //
  // 'GET' http method //
  productsRouter.get('/delete/screen',function(req,res){
      // Displays deleteProduct.jade //
      // It is a jade templating engine document which is used to create html data //
      res.render('deleteProduct');
  });

  // Create products API //
  // 'POST' http request for sending data //
  productsRouter.post('/create',function(req,res){
      // Check if all condition satisfies or not //
      // Here, 'req.body' is used to get data from the html body created using jade templating engine (bodyParser)//
      if(req.body.productName != undefined && req.body.productPrice != undefined && req.body.productDescription != undefined && req.body.sellerName != undefined && req.body.sellerAddress != undefined && req.body.sellerPinCode != undefined && req.body.sellerContactNumber != undefined)
      {
         // Creating a new product model and adding data we want to store in database into it //
         var productsData = new productsModel({
           productId           :  uniqid(), // To generate a unique id //
           productName         :  req.body.productName,
           productPrice        :  req.body.productPrice,
           productDescription  :  req.body.productDescription
         });

         // Creating seller object which is inside the products schema as a field //
         var seller = {
           'sellerId'             : uniqid(), // To generate a unique id //
           'sellerName'           : req.body.sellerName ,
           'sellerAddress'        : req.body.sellerAddress ,
           'sellerPinCode'        : req.body.sellerPinCode,
           'sellerContactNumber'  : req.body.sellerContactNumber
         };
         // Passing above created seller object to the products schema //
         productsData.productSeller = seller;

         // A variable to hold the categories after checking the data to store into it exists or not //
         // If exist, slipt the variable into an array using ',' condition //
         var categories = (req.body.productCategory != undefined && req.body.productCategory != null)?req.body.productCategory.split(','):'';
         // Passing above created categories array to the products schema //
         productsData.productCategory = categories;

         // Saving the model to the database //
         productsData.save(function(error){
           // If error occured //
           if(error)
           {
             // Send error response by using our custom library function to create custom json object // 
             var errorResponse = responseGenerator.generate(true,'Please Fill all the details',500,null);
             // Display error.jade page as response // 
             res.render('error',{
                // Passing data to the jade template from the response created above //
                message : errorResponse.message,
                status  : errorResponse.status
             });
           }
           else
           {
             // Send success response by using our custom library function to create custom json object // 
             var successResponse = responseGenerator.generate(false,'Product has been added.',200,productsData);
             // Send success response as the response //
             res.send(successResponse);
           }
         });
      }
      else
      {
        // Send error response by using our custom library function to create custom json object // 
        var errorResponse = responseGenerator.generate(true,'Please Fill all the details',500,null);
        res.send(errorResponse);
      }
  });
  
   // View all products API //
   // 'GET' http request for getting data //
   productsRouter.get('/all',function(req,res){
       // Find inside the products model //
       // The condition for finding is written inside: | find({--here--},func... |  //
       productsModel.find({},function(error,allProducts){
          // If error occured //
          if(error)
          {
            // Send error response generated by our library function as the response //
            var errorResponse = responseGenerator.generate(true,'Some error occured',500,null);
            res.send(errorResponse);
          }
          else
          {
            // Send success response generated by our library function as the response //
            var successResponce = responseGenerator.generate(false,'All products',200,allProducts);
            res.send(successResponce);
          }
       });
   });

   

   // Find particular product API //
   // 'GET' http request for getting data //
   productsRouter.get('/:productId',function(req,res){
     // Find a particular one inside the products model //
     // The condition for finding is written inside: | find({--here--},func... |  //
     productsModel.findOne({'productId':req.params.productId},function(error,foundProduct){
        if(foundProduct)
        {
          // Send success response generated by our library function as the response //
          var successResponse = responseGenerator.generate(false,'Product found',200,foundProduct);
          res.send(successResponse);
        }
        else
        {
          // Send error response generated by our library function as the response //
          var errorResponse = responseGenerator.generate(true,'Product not found',500,null);
          res.send(errorResponse);
        }
     });
   });

   // Edit products API //
   // 'PUT' http request for editing the data //
   productsRouter.put('/edit/:id',function(req,res){

      // Stroring all the variable passed from the jade template body in a single variable //
      var update = req.body;
      // Find a particular one inside the products model and then update it //
      // The condition for finding is written inside: | find({--here--},func... |  //
      productsModel.findOneAndUpdate({productId:req.params.id},update,function(err,success){
          // If success //
          if(success)
          {
            // Send success response generated by our library function as the response //
            var successResponse = responseGenerator.generate(false,'Product successfully updated',200,success);
            res.send(successResponse);
          }
          // If error //
          else
          {
            // Send error response generated by our library function as the response //
            var errorResponse = responseGenerator.generate(true,'Product not found',500,null);
            res.send(errorResponse);
          }
      });
    });

   // Delete products API //
   // 'POST' http request for deleting the data //
   productsRouter.post('/delete',function(req,res){
      // Find a particular one inside the products model and then delete it //
      // The condition for finding is written inside: | find({--here--},func... |  //
      productsModel.findOneAndRemove({productId:req.body.id},function(err,success){
          // If success //
          if(success)
          {
            // Send success response generated by our library function as the response //
            var successResponse = responseGenerator.generate(false,'Product successfully deleted',200,success);
            res.send(successResponse);
          }
          // If error //
          else
          {
            // Send error response generated by our library function as the response //
            var errorResponse = responseGenerator.generate(true,'Product not found',500,null);
            res.send(errorResponse);
          }
      });
   });
   
   // Find particular product's seller API //
   // 'GET' http request for getting the seller data //
   productsRouter.get('/seller/:sellerId',function(req,res){
     // Find a particular one inside the products model //
     // The condition for finding is written inside: | find({--here--},func... |  //
     productsModel.findOne({'productSeller.sellerId':req.params.sellerId},function(error,success){
        // If success //
        if(success)
        {
          // Send success response generated by our library function as the response //
          var successResponse = responseGenerator.generate(false,'Seller Found',200,success);
          res.send(successResponse);
        }
        // If error //
        else
        {
          // Send error response generated by our library function as the response //
          var errorResponse = responseGenerator.generate(true,'Seller not found',500,null);
          res.send(errorResponse);
        }
     });
   });


   // Here, router level middleware makes the below route as the default route for the products router // 
   app.use('/v1/products',productsRouter);
}
