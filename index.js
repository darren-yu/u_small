var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var db = require("./models/index.js");

// random id generator using npm hashids
var Hashids = require("hashids"),
	// my salt
	hashids = new Hashids("anbu112");

// var id = hashids.encode(    );
// var url = hashids.decode(    );

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
	res.render("index");
})

app.get("/thanks", function(req, res) {
	res.render("thanks");
})

app.post("/create", function(req, res) {


		db.User.findOrCreate({where: req.body}).done(function(err, data, wasMade) {
		if (wasMade) {
			var encrypt = hashids.encode(data.id);
			data.random_id = encrypt;
			data.save().done(function(err, data2) {
			res.render("thanks", {"key": data2.random_id});	
			})
		}
		else {
			res.render("thanks", {"key": data.random_id});
		}
	})
})

// working post script
// app.post("/create", function(req, res) {
	
// 	db.User.create(req.body).done(function(err, data) {
// 			var encrypt = hashids.encode(data.id);
// 			data.random_id = encrypt;
// 			data.save().done(function(err, data2) {
// 			// res.send(data2);
// 			res.render("thanks", data2);
// 			})
// 		})
// })


app.get("/:ranId", function(req, res) {
	db.User.find({where: {random_id: req.params.ranId}}).done(function(err, data) {
		// console.log("---------------------------^^^^^^" + data);
		res.redirect("http://" + data.url);
		// if(data){
		// 	res.redirect("www." + data.url);	
		// }
		// else{
		// 	res.send("url not found... try appending 'http://'");
		// }
		
	})
})




// var models = require("./models");
 
// models.Urls.findOrCreate({where:{url:"testurl654"}}).done(function(err,myUrl,created){
 
//     console.log('--------- WAS CREATED:',created);
 
//     //if it was created CREATE HASH
//     if(created){
//         myUrl.hash="testhash";
//         myUrl.save().done(function(err,savedObject){
//             console.log('--------- GENERATED HASH!!',savedObject.hash);
//             //res.render
//         });
//     }else{
//         //res.render
//         console.log('--------- ALREADY HAS HASH!!',myUrl.hash)
//     }
// });


// heroku uses another port, for developers we typically use 3000
app.listen(process.env.PORT || 3000);

