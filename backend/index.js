const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const authRouters = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const postRoutes = require('./routes/posts');


require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRouters);
app.use(errorHandler);
app.use('/api/posts', postRoutes);
app.use("/api/user", userRoutes);

mongoose
    .connect(process.env.MONGO_URL, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
     })
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("MongoDB connection error: ",err));

app.get("/",(req, res) => {
    res.send("Hello, Node.js!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
})