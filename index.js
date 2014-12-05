var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var db = require("./models/index.js");

// random id generator using npm hashids
var Hashids = require("hashids"),
	// my salt
	hashids = new Hashids("anbu112");

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
			res.render("thanks", {"key": data2.random_id,"oldURL": data.url});	
			})
		}
		else {
			res.render("thanks", {"key": data.random_id,"oldURL": data.url});
		}
	})
})


app.get("/:ranId", function(req, res) {
	db.User.find({where: {random_id: req.params.ranId}}).done(function(err, data) {
		// res.redirect("http://" + data.url);
		res.redirect(data.url);		
	})
})


app.listen(process.env.PORT || 3000);

