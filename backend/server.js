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

// compress the res data transfer
app.use(compression())

// cors - cross origin sharing - (http-request)
app.use(cors())


// all routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/accounts', require('./routes/accountsRoutes'));
app.use('/api/inNetwork', require('./routes/inNetworkRoutes'));
app.use('/api/openIssues', require('./routes/openIssuesRoutes'));
app.use('/api/portalLogins', require('./routes/portalLoginsRoutes'));
app.use('/api/pif', require('./routes/pifRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
      )
    );
  } else {
    app.get('/', (req, res) => res.send('Please set to production'));
  }



// error handler middleware - return structured error message - this should be always placed beneath the routes to work
app.use(errorHandler);




app.listen(port, ()=> console.log(`Server started on ${port}`));