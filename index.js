require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, {
    // Use updated connection options
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("static"));

// Schema and Model
const urlSchema = new mongoose.Schema({
    mainurl: String,
    shorturl: String
});
const newuri = mongoose.model("newuri", urlSchema);

// Helper function to generate random strings
function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/create', async (req, res) => {
    try {
        const url = req.body.url;
        const shortUrlId = generateString(5);
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortUrlId}`;
        const ShortUrl = new newuri({
            mainurl: url,
            shorturl: shortUrl
        });
        const savedShortUrl = await ShortUrl.save();
        console.log(savedShortUrl);
        res.json(savedShortUrl.shorturl);
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const shortUrl = `${req.protocol}://${req.get('host')}/${id}`;
        const url = await newuri.findOne({ shorturl: shortUrl });
        if (url) {
            res.redirect(url.mainurl);
        } else {
            res.status(404).json({ message: 'URL not found' });
        }
    } catch (error) {
        console.error('Error finding URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}...`);
});
