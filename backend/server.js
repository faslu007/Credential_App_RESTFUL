const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const {errorHandler} = require('./middleware/errorMiddleware')
const colors = require('colors');
const connectDB = require('./config/db');
const multer = require("multer");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const compression = require('compression')

connectDB();

// for parsing application/json
app.use(bodyParser.json());

app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// app.use(upload.array()); 
app.use(express.static('public'));

// compress the req & res data transfer
app.use(compression({
    level: 9,
    threshold: 0
}))


// all routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accounts', require('./routes/accountsRoutes'));
app.use('/api/inNetwork', require('./routes/inNetworkRoutes'));

// error hander middlware - return structured error message
app.use(errorHandler);


app.listen(port, ()=> console.log(`Server started on ${port}`));