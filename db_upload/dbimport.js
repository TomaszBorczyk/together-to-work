fs = require('fs');
readline = require('readline');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:pwd123@localhost:27017/together-to-work';
var streets = [ ];
var myInterface = readline.createInterface({ input: fs.createReadStream('wroclaw_streets.txt')});

myInterface.on('line', function (line) {
  var obj = {'name': line};
  streets.push(obj);})

myInterface.on('close', function(){
  console.log(streets.length)

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("streets").insertMany(streets, function(err,res){
      if (err) throw err;
      console.log("records inserted");
      db.close();
    })
  })
})
