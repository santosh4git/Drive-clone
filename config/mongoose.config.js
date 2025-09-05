const mongoose = require('mongoose');

// This function will connect to the database and handle success/failure
async function connectToDB() {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Connected to database successfully.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        // Throw the error so the calling function can catch it
        throw error;
    }
}

module.exports = connectToDB;
