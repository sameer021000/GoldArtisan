require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./Mediator/Operations');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GoldArtisan';

const app = express();

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());
app.use('/Operations', authRoute);

mongoose.connect(MONGODB_URI)
.then(() =>
{
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () =>
    {
        console.log(`Server running on PORT : ${PORT}`);
    });
})
.catch((err) =>
{
  console.error('MongoDB connection error:', err);
  process.exit(1);
});