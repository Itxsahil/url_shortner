require('dotenv').config()
const express = require('express')
const path = require('path');
const app = express()



const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/newdb")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("static"));

const urlSchema = new mongoose.Schema({
    mainurl : String,
    shorturl : String
})

const newuri = mongoose.model("newuri",urlSchema)



function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
});


app.post('/create',async(req, res)=>{
    const url = req.body.url
    const ShortUrl =  new newuri({
        mainurl : url,
        shorturl : "http://localhost:"+ PORT + "/" + generateString(5),        
    })
    const shortUrl = await ShortUrl.save()
    console.log(shortUrl)
    res.json(shortUrl.shorturl)
})

app.get('/:id',async(req, res )=>{
    const id = req.params.id
    const url = await newuri.findOne({shorturl : "http://localhost:"+ PORT + "/" + id})
    res.redirect(url.mainurl)
})

app.listen(process.env.PORT, ()=> console.log(`Server is livr on port ${PORT} .....`))