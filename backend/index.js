const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");

const authRouters = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/userRoutes');

require("dotenv").config();

const app = express();


app.use(cors({
    orign: "http://localhost:3000",
    credentials: true,
}));

// app.use(bodyParser.json());
// ✅ Body parser
app.use(express.json());

app.use('/api/auth', authRouters);
app.use(errorHandler);
app.use('/api/posts', postRoutes);
app.use("/api/userRoutes", userRoutes);


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("MongoDB connection error: ",err));

app.get("/",(req, res) => {
    res.send("Hello, Node.js!");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
})