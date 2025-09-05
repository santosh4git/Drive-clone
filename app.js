const express = require('express');
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes');
const connectToDB = require('./config/mongoose.config');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.static('public'));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.use('/user', indexRoutes);
app.use('/user', userRoutes);

// A function to connect to the database and then start the server
const startServer = async () => {
    try {
        await connectToDB();
        // Start the server ONLY after the database connection is successful
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening at port number ${process.env.PORT}`);
            
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
};

// Call the function to begin the process
startServer();
