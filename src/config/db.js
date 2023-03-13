const mongoose = require('mongoose');
const APP_DB_URL = process.env.APP_DB_URL;

/***
 * Database Connection With Mongodb
 */
class DBConnection {   

    /**
     * DB Connection function
     */
    static connect() {
        mongoose.connect(APP_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true}) 
        .then(() => {
            console.log("Successfully connect to MongoDB.");
        })
        .catch(err => {
            console.error("Connection error", err);
            process.exit();
        });
    }
}

/***Exports module***/
module.exports = DBConnection;