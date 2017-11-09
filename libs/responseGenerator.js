// This is an custom library function used for creating a json object for sending response to the browser //
// Here, 'exports' is used so that other files and functions can also call this function throughout the app //
exports.generate = function(error,message,status,data){

  // Json object for response //
  var myResponse = {
      error    :  error, // If error , set it as true(error exist) and if success, set it as false(error doesn't exist) //
      message  :  message, // Our own custom message according to the conditon //
      status   :  status, // Error status , Mainly used : 404 (NOT FOUND) and 500 (INTERNAL SERVER ERROR) //
      data     :  data // Data received from the function where it is used according to conditions //
  };

  // Return the custom json object created above //
  return myResponse;
}
