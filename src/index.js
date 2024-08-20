require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const authRoute = require('../routes/auth')
const blogsRoute = require('../routes/blogs')
const profileRoute = require('../routes/profileBlogs')
const tagsRoute = require('../routes/tagsRoute')
const cors = require('cors');

const app = express()

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
console.log('DB_URL:', process.env.DB_URL);



// process.env.DB_URL = "mongodb+srv://himanshudangwal99:hd27855647@cluster0.fmw4tal.mongodb.net/newton?retryWrites=true&w=majority";

// const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017';
// console.log('DB_URL:', dbUrl); // Should print the MongoDB URI



app.use(cors());
// console.log('Process Env:', process.env); // Print all environment variables

async function connectToMongo() {
    mongoose.set("strictQuery", false);
    try {
        await mongoose.connect(dbUrl);
        console.log("Successfully connected to MongoDB database");
        console.log("Connected to database:", mongoose.connection.name); // Logs the database name
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}


connectToMongo().catch(err => console.log("Some error"));


// middleware
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.send("Hello world")
})

app.use('/api/auth', authRoute)
app.use('/api/blogs', blogsRoute)
app.use('/api/profile',profileRoute)
app.use('/api/tags',tagsRoute)

const port = process.env.PORT || 8080
app.listen(port, (req, res) => {
    console.log('Listening to the port 8080');
})
