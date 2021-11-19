// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const MongoClient = require('mongodb').MongoClient;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/input", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// https://expressjs.com/en/starter/basic-routing.html
// app.get("/login", (request, response) => {
//   response.sendFile(__dirname + "/views/log-in.html");
// });

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  if(request.cookies.user) {
    response.sendFile(__dirname + "/views/search.html");
  } else {
    response.sendFile(__dirname + "/views/log-in.html");
  }
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

// GET でもできますが、インターンの講義で教えたやり方でやるなら、POST の方が楽。
// GET: 取得、POST: 送信、なので、検索機能の場合は本当は GET の方が良いです。
app.post('/find', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  // req.on('end', function(){ ... }) というのが必要で、
  // received にデータが入った後の処理はこの中に書く必要があります。
  req.on('end', function() {
    const search_junle = JSON.parse(received).search_junle;
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colDishes = db.collection('dishes'); // 対象コレクション
      
      // Iさん (個人名は隠しておきます) のコードでは search_junle が主食であれば、condition に"主食"を入れる、
      // というような記述がありましたが、セレクトボックスの値をうまくとれていれば、
      // それをそのまま condition にセットするだけで上手く検索できます。
      const condition = {junle: search_junle}; // 検索条件
      
      colDishes.find(condition).toArray(function(err, dishes) {
        res.json(dishes);
        client.close();
      });
    });
  });
});

app.post('/save', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
  const dish = JSON.parse(received); // 保存対象
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colDishes = db.collection('dishes'); // 対象コレクション
    colDishes.insertOne(dish, function(err, result) {
      res.sendStatus(200); // HTTP ステータスコード返却
       client.close(); // DB を閉じる
     });
   });
  });
});

// app.post('/save', function(req, res) {
//   let received = '';
//   req.setEncoding('utf8');
//   req.on('data', function(chunk) {
//     received += chunk;
//   });
//   req.on('end', function() {
//     MongoClient.connect(mongouri, function(error, client) {
//       const db = client.db(process.env.DB); // 対象 DB
//       const colUser = db.collection('users'); // 対象コレクション
//       const user = JSON.parse(received); // 保存対象
//       colUser.insertOne(user, function(err, result) {
//         res.sendStatus(200); // HTTP ステータスコード返却
//         client.close(); // DB を閉じる
//       });
//     });
//   });
// });

app.post('/login', function(req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const col = db.collection('sample_accounts'); // 対象コレクション
    const condition = {name:{$eq:userName}, password:{$eq:password}}; // ユーザ名とパスワードで検索する
    col.findOne(condition, function(err, user){
      console.log(user);
      client.close();
      if(user) {
        res.cookie('user', user); // ヒットしたらクッキーに保存
        console.log('OK');
        res.redirect('/'); // リダイレクト
      }else{
        console.log('NG');
        res.redirect('/failed'); // リダイレクト
      }
    });
  });
});


// https://expressjs.com/en/starter/basic-routing.html
app.get("/input", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/toform", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/index", (request, response) => {
  response.sendFile(__dirname + "/views/search.html");
});
