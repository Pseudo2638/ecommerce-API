// Including express and cluster module //
var express = require('express');
var cluster = require('cluster');

// By default, cluster.isMaster is set to true for our convienience by node developers //
// So, if true //
if(cluster.isMaster)
{
  // Note, here we user 'os' which is an module for node to refer to the system os and get details of it //
  // Then using 'os' we check the no of cpu's in the current machine //
  // Here, we do the above and save it in a varibale //
  var numWorkers = require('os').cpus().length;

  // For developer's reference //
  console.log('Master cluster setting up  ' + numWorkers + '  workers ....');

  // 'fork' means to divide in general //
  // Here also, 'fork' means to divide and since on cluster we have used 'fork' //
  // cluster is forked into the [numWorkers] parts //
  for (var i = 0; i < numWorkers; i++) {

    // Since node is single threaded, so in order to make the program scalable //
    // We divide the load of the program onto the number of proccessors on the current machine //
    // This helps us maintain server efficiently and handle server breakdowns //

    cluster.fork();
  };

  // Just like events //
  // When cluster is online //
  cluster.on('online',function(worker){

        // For developer's reference //
        console.log('Worker  ' + worker.process.pid + '  is online.')
  });

  // When cluster goes offline //
  cluster.on('exit',function(worker,code,signal){
        
        console.log('Worker  ' + worker.process.pid + '  died with code :  ' + code );
        console.log('Starting a new worker.');

        // Whenever a process dies, a new process is started which makes our server up always //
        cluster.fork();
  });
}
else
{

  // Including javascript file //
  require('./server.js');
}







