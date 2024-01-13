const express = require('express');
require('dotenv').config(); 
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require("./middleware/errorHandler");
const connectDB = require('./config/db');

const app = express();

const PORT = 3000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.json());
app.use("/api/contacts",contactRoutes);
app.use("/api/user",userRoutes);
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
});

