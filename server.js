// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;



// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/input", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/log-in.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// GET リクエストを /get1 で受け取ったときの処理
app.get('/get1', function(request, response) {
  response.send('<h1>' + request.query.param1 + '</h1>');
});

app.post('/post1', function(request, response) {
  response.send('受け取った値は：' + request.body.param1);
});

app.get('/find', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colUser = db.collection('users'); // 対象コレクション
    const condition = {}; // 検索条件（全件取得）
    colUser.find(condition).toArray(function(err, users) {
      res.json(users); // JSON 形式で画面に返す
      client.close(); // DB を閉じる
    });
  });
});

app.get('/save', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colUser = db.collection('users'); // 対象コレクション
    const user = {name: '鈴木', age:35}; // 保存対象
    colUser.insertOne(user, function(err, result) {
      res.sendStatus(200); // HTTP ステータスコード返却
      client.close(); // DB を閉じる
    });
  });
});

app.post('/save', function(req, res) {
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colUser = db.collection('users'); // 対象コレクション
      const user = JSON.parse(received); // 保存対象
      colUser.insertOne(user, function(err, result) {
        res.sendStatus(200); // HTTP ステータスコード返却
        client.close(); // DB を閉じる
      });
    });
  });
});


// https://expressjs.com/en/starter/basic-routing.html
app.get("/log-in", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/toform", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
