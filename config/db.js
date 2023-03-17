const mongoose = require('mongoose');

async function connectToDB() {
        try {
            await mongoose.connect(process.env.DB_URL)
            console.log("Database is up on " + process.env.DB_URL);
        } catch (err) {
            console.log(err);
            process.exit();
        }
}

module.exports = connectToDB;