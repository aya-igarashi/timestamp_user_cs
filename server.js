const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//envファイルからmongoDB接続
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


app.use(express.static("public"));
// listen for requests :)


// 最初のページを表示
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/view/log-in.html");
});

//ログイン認証
app.post('/admin', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
  const user_np = JSON.parse(received); // 保存対象
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colUsers = db.collection('users'); // 対象コレクション
    console.log(user_np);
    const name = user_np[0]
    const password = user_np[1]
    const condition = {$and:[{name:name},{password:password}]};
    colUsers.find(condition).toArray(function(err, result) {
      console.log(result);
      
      //if(result){
        //index.htmlページへ遷移
      //}
      
      client.close(); // DB を閉じる
     });
   });
  });
});


//時間の打刻
app.post('/stamp', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
  const timestamp = JSON.parse(received); // 保存対象
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colTimemanagement = db.collection('timemanagement'); // 対象コレクション
    colTimemanagement.insertOne(timestamp, function(err, result) {
      res.sendStatus(200); // HTTP ステータスコード返却
       client.close(); // DB を閉じる
     });
   });
  });
});
