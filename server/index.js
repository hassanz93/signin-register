const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = express();
const cors = require("cors")
//import Routes from auth.js
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts.js');

dotenv.config();

// connect to databse in MongDb
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true},
    () => {console.log("Connect to MongoDB")}
                )

//Middleware
app.use(express.json());
app.use(cors());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log("Server is Up and running"));