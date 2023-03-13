const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const env = require('dotenv');
const cors = require('cors');
const path = require('path');
// const routerConfig = require('./routers/index.router');

const app = express();

env.config({
    path: '.env'
})

/**DB Connection**/
const dbConnection = require('./config/db');
dbConnection.connect();

var options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
  
/** Logging */
app.use(morgan('dev'));
app.use(cors(options));
app.use(compression());
app.use(helmet());
/** Takes care of JSON data */
app.use(express.json({ limit: '50mb' }));  
/** Parse the request */
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

/** Routes */
// routerConfig(app)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`)
})
