const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const compression = require('compression') // compress req & res data transfer
const colors = require('colors'); // dev dependency to change console message color
const connectDB = require('./config/db');
const cors = require('cors')
const path = require("path");
const {errorHandler} = require('./middleware/errorMiddleware')
const app = express();


connectDB();

// for parsing application/json
app.use(bodyParser.json());
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// app.use(upload.array()); 
app.use(express.static('public'));

// compress the req & res data transfer
app.use(compression())

// cors - cross origine sharing - (http-reqest)
app.use(cors())


// all routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accounts', require('./routes/accountsRoutes'));
app.use('/api/inNetwork', require('./routes/inNetworkRoutes'));

// error handler middleware - return structured error message
app.use(errorHandler);



app.listen(port, ()=> console.log(`Server started on ${port}`));