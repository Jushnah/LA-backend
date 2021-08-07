const express = require('express');
const BookData = require('./src/model/bookdata');
const AuthorData = require('./src/model/authordata');
const UserData = require('./src/model/userdata')
const cors = require('cors');
const jwt = require('jsonwebtoken');
var bodyparser = require('body-parser');
var app = new express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
  }));

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unothorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send('Unauthorised request')
    }
    let payload = jwt.verify(token,'secretKey')
    console.log(payload)
    if(!payload){
        return res.status(401).send('Unauthorised request')
    }
    req.userId = payload.subject
    next()
}

app.get('/books',function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    BookData.find()
        .then(function(books){
            res.send(books);
        });
});

app.get('/books/:id',  (req, res) => {
  
    const id = req.params.id;
      BookData.findOne({"_id":id})
      .then((book)=>{
          res.send(book);
      });
  })
  app.delete('/removebook/:id',(req,res)=>{
   
    id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
    

app.get('/authors',function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    AuthorData.find()
        .then(function(authors){
            res.send(authors);
        });
});

app.get('/authors/:id',  (req, res) => {
  
    const id = req.params.id;
      AuthorData.findOne({"_id":id})
      .then((author)=>{
          res.send(author);
      });
  })
  
  app.delete('/removeauthor/:id',(req,res)=>{
   
    id = req.params.id;
    AuthorData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })

app.post('/insertbook',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var book = {
        title: req.body.book.title,
        author: req.body.book.author,
        genre: req.body.book.genre,
        about: req.body.book.about,
        image: req.body.book.image
    }
    var book = new BookData(book);
    book.save();
});

app.post('/insertauthor',function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var author = {
        name: req.body.author.name,
        about: req.body.author.about,
        image: req.body.author.image
    }
    var author = new AuthorData(author);
    author.save();
})

app.post('/signup',function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var user = {
        user: req.body.user.user,
        password: req.body.user.password,
        email: req.body.user.email
    }
    var newuser = new UserData(user);
    newuser.save();
})



app.post('/login',async(req,res)=>{
    let userData = req.body

    const username = userData.uname;
    const password = userData.password;
    const user = await (UserData).findOne({ user : username , password : password }); 
    if(user){
        if(!username){
            res.status(401).send('Invalid Username')
        }else
        if( password!== user.password){
            res.status(401).send('Invalid Password')
        }else{
            let payload = { subject:username+password }
            let token = jwt.sign(payload,'secretKey')
            res.status(200).send(token)
        }
    }
   else if(username=='admin'){
       if(username=="admin"&&password=="Admin@LA9"){
            role = admin
            let payload ={role:role,username:"admin"}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})
       }
   }
   else{
    res.status(401).send('Invalid Username/Password')
  }

})

app.put('/updatebook',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body)
    id=req.body._id,
    title= req.body.title,
    author= req.body.author,
    genre= req.body.genre,
    about= req.body.about,
    image= req.body.image
   BookData.findByIdAndUpdate({"_id":id},
                                {$set:{"title" : title,
                                        "author" : author,
                                        "genre" : genre,
                                        "about" : about,
                                        "image" : image}})
   .then(function(){
       res.send();
   })
 })
 
 app.put('/updateauthor',(req,res)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body)
    id=req.body._id
    var author = {
        name: req.body.name,
        about: req.body.about,
        image: req.body.image
    }
   AuthorData.findByIdAndUpdate({"_id":id},
                                {$set: author})
   .then(function(){
       res.send();
   })
 })

app.listen(3000, function(){
    console.log('listening to port 3000');
});