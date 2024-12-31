const express=require('express');
const session=require('express-session');

const app=express();
const bcrypt1=require('bcryptjs')
const bcrypt=require('bcrypt')
const bodyParser=require('body-parser');
const {MongoClient}=require('mongodb');
app.use(express.json());

app.use(bodyParser.urlencoded({extended:false}));
require('dotenv').config()
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
  }));
const port=process.env.port || 9000;
const url='mongodb://127.0.0.1:27017';
const dbName='Omkar';
app.set('view engine','ejs');

app.get('/read',(req,res)=>{
    res.render('index2');
})

app.get('/logout',(req,res) => {
    res.render('index2');
})

app.get('/create',(req,res)=>{
    res.render('index1');
})

app.post('/read', async (req, res) => {
        const { username, password } = req.body;
        const client = new MongoClient(url)
        const db=client.db(dbName);
        await client.connect();
        const usersCollection = db.collection('Login');
        const user = await usersCollection.findOne({ Username:username });
        req.session.user=username;
        if (user && await bcrypt.compare(password, user.Password)) {
          // Passwords match, user is authenticated
          res.render('shopping1');
        } else {
          // Passwords do not match, show an error message
          res.send('Login failed');
        }
      });


app.post('/create',async(req,res)=>{
    const {firstname,lastname,email,gender,phone,age,username,password,confirmpassword} = req.body;
    const client = new MongoClient(url)
    const db=client.db(dbName);
    if(password == confirmpassword){    
        const hashedPassword = await bcrypt.hash(password, 10);
  

        await client.connect();
        const usersCollection = db.collection('Login');
        const newUser={First_Name:firstname,Last_Name:lastname,Email:email,Gender:gender,Contact:phone,Age:age,Username:username,Password:hashedPassword}
   
    const a=await usersCollection.insertOne(newUser);
    req.session.usern=a
    if(a){
        res.send("Records inserted")
    }
    else{
        res.send("Error while inserting records");
    }
    }
    else{
        res.send("Passwords do not match");
    }

})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

