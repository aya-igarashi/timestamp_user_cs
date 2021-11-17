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

//login機能
const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-local'); 
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const server = express();
const port = process.env.PORT || 8080;

mongoose.connect(mongouri,{useNewUrlParser: true});
const db =  mongoose.connection;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
});

db.on('error', console.error.bind(console, 'connection error:'));

server.use(bodyParser.urlencoded({extended: true}));
server.use(cookieParser());
server.use(session({ resave: false, saveUninitialized:false, secret: 'something quite long and nonsense',
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

server.use(passport.initialize());
server.use(passport.session());

passport.use(new Strategy 
    (async (username, password, done) => {
        try{
            await db.model('database', userSchema, 'users')
            .findOne({username: username}, (err, user) => {
                if(err){
                    return done(err);
                }
                if(!user){
                    return done(null, false);
                }
                if(user.toObject().password != password){
                    return done(null, false);
                }
                return done(null, user);
            })
        } catch(err) {
            console.log(err);
        }
    }
));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html/')
);
});
  
server.post('/admin', passport.authenticate('local', {failureRedirect:'/' }),
    (req, res) => {
        res.send('Success!');
    }
);

server.get('/admin',(req, res) => {
    if(!req.user){
        res.redirect('/');
    }
    else{
        res.send('still logged in!')
    }
});

passport.serializeUser( (user, cb) => {
    cb(null, user);
});

passport.deserializeUser( async (id, cb) => {
    try{
        await db.model('database', userSchema, 'users').findById(id, (err, user) => {
            cb(err, user);
        })
    } catch(err) {
        console.log(err);
    }
});

server.listen(port);

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

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/search.html");
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
    const colDishes = db.collection('dishes'); // 対象コレクション
    const condition = {}; // 検索条件（全件取得）
    colDishes.find(condition).toArray(function(err, dishes) {
      res.json(dishes); // JSON 形式で画面に返す
      client.close(); // DB を閉じる
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
