var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
var cors = require("cors");
app.use(cors());

var cloudant = require("@cloudant/cloudant");
var url =
  "https://apikey-v2-1jb4p2knshgyiq8ehchhptkcsw8o4h6rksll2qnchh5r:28f492131e082702348702c8b64357d8@72dba83e-39d0-49f6-be04-1a47688ca98b-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-1jb4p2knshgyiq8ehchhptkcsw8o4h6rksll2qnchh5r";
var password = "28f492131e082702348702c8b64357d8";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Welcome to cloudant database on IBM Cloud");
});

app.post("/insert-document", function (req, res) {
    const { id, name, address, phone, email, country, city, pincode } = req.body;
    const database_name = "db_data_practical_dk";

    cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
        if (err) {
            return console.log("Failed to initialize Cloudant: " + err.message);
        }

        cloudant.use(database_name).insert({ name: name, address: address, phone: phone, email: email, country: country, city: city, pincode: pincode }, id, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send("document inserted");
            }
        });
    });
});

app.listen(port, function () {
    console.log("Server is running on port " + 'http://localhost:' + port);
});