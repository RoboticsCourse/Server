var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
const child_process = require('child_process');
var spawn = require("child_process").spawn;
var port = 10023;
const multer = require('multer');

const sqlite3 = require('sqlite3').verbose();

var bodyParser = require('body-parser');
var recentImg = "";
var data = "";
var serverOn = "F";
var pairs = [];

app.use(express.static('static-content'));
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

var db = new sqlite3.Database('db/database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static-content/videos/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })


app.get('/getInfo/', function (req, res) {
  res.json({ "filename": recentImg, "data": data, "serverOn": serverOn });
})

app.get('/getFiles/', function (req, res) {
  const folderpath = "./static-content/images/";
  child_process.execSync(`zip -r files *`, {
    cwd: folderpath
  });
  res.send({ "success": true, "filename": "files.zip", "path": "./images/files.zip" })
})

app.get('/getJSON/', function (req, res) {
  res.send({ "success": true, "filename": "data.json", "path": "./images/data.json" })
})

app.get('/getModel/', function (req, res) {
  const folderpath = "./model/";
  child_process.execSync(`zip -r ../static-content/mdl.zip *`, {
    cwd: folderpath
  });
  res.send({ "success": true, "filename": "mdl.zip", "path": "./mdl.zip" })
})

app.get('/getDB/', function (req, res) {
  const folderpath = "./db/";
  child_process.execSync(`zip -r ../static-content/db.zip *`, {
    cwd: folderpath
  });
  res.send({ "success": true, "filename": "db.zip", "path": "./db.zip" })
})

app.get('/clearDBData/', function (req, res) {
  let sql = "DROP TABLE IF EXISTS data";

  db.run(sql, function (err) {
    if (err) {
      res.json({ "success": false, "error": err });
    }
    else {
      sql = "CREATE TABLE data (id INTEGER PRIMARY KEY," +
        "time VARCHAR(30) NOT NULL," +
        "F VARCHAR(15) NOT NULL," +
        "S VARCHAR(15) NOT NULL," +
        "Sensor1 VARCHAR(15) NOT NULL," +
        "Sensor2 VARCHAR(15) NOT NULL," +
        "State VARCHAR(5) NOT NULL," +
        "Valid VARCHAR(1) NOT NULL)";

      db.run(sql, function (err) {
        if (err) {
          res.json({ "success": false, "error": err });
        }
        else {
          res.json({ "success": true });
        }
      });
    }
  });
})

app.get('/clearDBImgs/', function (req, res) {
  let sql = "DROP TABLE IF EXISTS images";

  db.run(sql, function (err) {
    if (err) {
      res.json({ "success": false, "error": err });
    }
    else {
      sql = "CREATE TABLE images (id INTEGER PRIMARY KEY," +
        "filename VARCHAR(30) NOT NULL)";

      db.run(sql, function (err) {
        if (err) {
          res.json({ "success": false, "error": err });
        }
        else {
          res.json({ "success": true });
        }
      });
    }
  });
})

app.get('/clearDBPair/', function (req, res) {
  let sql = "DROP TABLE IF EXISTS imgData";

  db.run(sql, function (err) {
    if (err) {
      res.json({ "success": false, "error": err });
    }
    else {
      sql = "CREATE TABLE imgData (id INTEGER PRIMARY KEY," +
        "imgId INTEGER NOT NULL," +
        "dataId INTEGER NOT NULL)";

      db.run(sql, function (err) {
        if (err) {
          res.json({ "success": false, "error": err });
        }
        else {
          res.json({ "success": true });
        }
      });
    }
  });
})

app.get('/clearModel/', function (req, res) {
  const directory = "./model/";

  fs.readdir(directory, (err, files) => {
    if (err){
      res.json({ "success": false, "error": err });
    }

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err){
          res.json({ "success": false, "error": err });
        }
      });
    }
  });
  res.json({ "success": true });
})

app.get('/createPairs/', function (req, res) {
  console.log("Started creating pairs")
  var process = spawn('python', ["./script.py", "pair"]);

  process.stdout.on('data', function (data) {
    res.send(data.toString());
  })
})

app.get('/getVideos/', function (req, res) {
  const directory = "./static-content/videos/";

  fs.readdir(directory, (err, files) => {
    if (err){
      res.json({ "success": false, "error": err });
    }
    else {
      res.send({"success": true, "Files": files})
    }
  });
})

app.put('/createImages/', function (req, res) {
  console.log("Started creating images");
  console.log(req.body)
  console.log("Path: " + req.body.path + " Time: " + req.body.time);
  var process = spawn('python', ["./script.py", "split", req.body.path, req.body.time]);

  process.stdout.on('data', function (data) {
    res.send(data.toString());
  })
})

app.post('/uploadVid/', upload.single('file'), (req, res, next) => {
  const file = req.file;
  console.log("Filename: " + file);
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    res.send({"success": false, "error": "Please upload a file"});
  }
  res.send({"success": true});
})

app.get('/getPairs/', function (req, res) {
  let sql = 'select d.time,d.F,d.S,d.Sensor1,d.Sensor2,d.State,i.filename from imgData as imgD inner join data as d on d.id = imgD.dataId  inner join images as i on i.id = imgD.imgId';
  pairs = [];
  db.all(sql, function (err, rows) {
    if (err != null) {
      console.log(err);
      callback(err);
    }

    rows.forEach((row) => {
      pairs.push({
        "State": row.State,
        "Filename": (row.filename).split(":").join("_"),
        "Sensor2": row.Sensor2,
        "Forward": row.F,
        "Data Time": row.time,
        "Sensor1": row.Sensor1,
        "Image Time": row.filename,
        "Speed": row.S
      });
    });

    fs.writeFile("./static-content/images/data.json", JSON.stringify(pairs), 'utf8', err => {
      if (err) {
        console.log(err);
      } else {
        fs.chmodSync("./static-content/images/data.json", 0644);
      }
    });

    res.json({ "success": pairs });
  });
})

app.post('/uploadData', function (req, res) {
  var objStr = Object.keys(req.body)[0];
  data = objStr
  if (objStr != "STOP" && objStr != "START") {
    var index = objStr.indexOf("actions");
    objStr = objStr.slice(0, index + 9) + "[" + objStr.slice(index + 9, objStr.length - 1) + "]}";
    var actions = JSON.parse(objStr).actions;
    actions = actions.map((actions) => {
      elem = Object.entries(actions)[0];
      return [elem[0], elem[1].F, elem[1].S, elem[1].Sensor1, elem[1].Sensor2, elem[1].State, serverOn];
    });
    console.log(actions)
    size = actions.length;
    console.log("Size: " + size)
    while (size > 0) {
      max = Math.min(size, 100);
      let cc_actions = actions.splice(0, max);
      let placeholders = cc_actions.map(() => '(?,?,?,?,?,?,?)').join(',');
      cc_actions = [].concat(...cc_actions);
      let sql = 'INSERT INTO data(time,F,S,Sensor1,Sensor2,State,Valid) VALUES' + placeholders;
      console.log(placeholders);
      console.log(cc_actions);
      db.run(sql, cc_actions, function (err) {
        if (err) {
          console.log(err.message);
        }
      });
      size -= max;
      console.log("Size: " + size)
    }
    res.json({ "success": "Data uploaded" });
  }
  else if (objStr == "STOP") {
    serverOn = "F"
    res.json({ "success": "Server stopped" });
  }
  else if (objStr == "START") {
    serverOn = "T"
    res.json({ "success": "Server started" });
  }
})

app.listen(port, function () {
  console.log('Server running on port: ' + port);
});
