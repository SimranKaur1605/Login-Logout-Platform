const express = require('express');
const app = express();
const userModel = require('./models/user');  // Correctly required user model

const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  

app.get('/', function(req, res) {
    res.render('index');
});


app.post("/create",  function (req, res){
    let {username, email, password,age} = req.body;

    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(password,salt, async (err, hash) =>{
            let createduser = await userModel.create({
                username,
                email,
                password : hash,
                age
            })
            let token = jwt.sign({email}, "kabu");
            res.cookie("token", token)
            res.send(createduser);;
        })
    })

    
})

app.get("/login" , function(req, res){
    res.render('login')
})

app.post("/login", async function(req, res){
    let user = await userModel.findOne({email: req.body.email});
    //if(!user) return res.send("something went wrong");
    
    
    bcrypt.compare(req.body.password, user.password ,function(err, result ){
        if(result) res.send("You can login")
        else res.send("SORRY BRO")
    })
 })

app.get("/logout" ,function(req, res){
    res.cookie("token", "");
    res.redirect("/")
});

app.listen(3001, function () {
    console.log('CODE RUN');
});

