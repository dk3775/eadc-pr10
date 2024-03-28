const express = require("express");
const bodyParser = require("body-parser");
const Cloudant = require("@cloudant/cloudant");

const PORT = process.env.PORT || 8000;
const url = "https://apikey-v2-1jb4p2knshgyiq8ehchhptkcsw8o4h6rksll2qnchh5r:28f492131e082702348702c8b64357d8@72dba83e-39d0-49f6-be04-1a47688ca98b-bluemix.cloudantnosqldb.appdomain.cloud";
const username = "apikey-v2-1jb4p2knshgyiq8ehchhptkcsw8o4h6rksll2qnchh5r";
const password = "28f492131e082702348702c8b64357d8";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Welcome to cloudant database on IBM Cloud");
});

app.get("/list_of_databases", function (req, res) {
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.db.list()
      .then((body) => {
        res.send(body);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

app.post("/create-database", (req, res) => {
  const name = req.body.name;
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.db.create(name, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("database created");
      }
    });
  });
});

app.post("/insert-document", function (req, res) {
  const { id, name, address, phone, age } = req.body;
  const database_name = req.body.db;
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.use(database_name).insert({ name: name, address: address, phone: phone, age: age }, id, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  });
});

app.post("/insert-bulk/:database_name", function (req, res) {
  const database_name = req.params.database_name;
  const students = [];

  for (let i = 0; i < 3; i++) {
    const student = {
      _id: req.body.docs[i].id,
      name: req.body.docs[i].name,
      address: req.body.docs[i].address,
      phone: req.body.docs[i].phone,
      age: req.body.docs[i].age,
    };

    students.push(student);
  }

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.use(database_name).bulk({ docs: students }, function (err) {
      if (err) {
        throw err;
      }

      res.send("Inserted all documents");
    });
  });
});

app.delete("/delete-document", function (req, res) {
  const { id, rev } = req.body;
  const database_name = req.body.db;

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.use(database_name).destroy(id, rev, function (err) {
      if (err) {
        throw err;
      }

      res.send("document deleted");
    });
  });
});

app.put("/update-document", function (req, res) {
  const { id, rev, name, address, phone, age } = req.body;
  const database_name = req.body.db;

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log("Failed to initialize Cloudant: " + err.message);
    }

    cloudant.use(database_name).insert({
      _id: id,
      _rev: rev,
      name: name,
      age: age,
      address: address,
      phone: phone,
    }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  });
});

app.listen(PORT);