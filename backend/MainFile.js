require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GoldArtisan';
const path = require('path'); // added to serve uploads
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,   // your deployed vercel site
  "http://localhost:3000",    // local frontend
  "http://127.0.0.1:3000"     // alternative localhost
];

app.use(cors({
  origin: function (origin, callback) {
    // allow tools like curl/Postman with no origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS BLOCKED Origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json());

// serve uploaded files so frontend can request them at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const gaSignUpPath = require('./Paths/GASignUpPath');
const gaSignInPath = require('./Paths/GASignInPath');
const gaDetailsGettingPath = require('./Paths/GADetailsGettingPath');
const gaProfilePhotoUploadingPath = require('./Paths/GAProfilePhotoUploadingPath');

app.use('/GASignUpPath', gaSignUpPath);
app.use('/GASignInPath', gaSignInPath);
app.use('/GADetailsGettingPath', gaDetailsGettingPath);
app.use('/GAProfilePhotoUploadingPath', gaProfilePhotoUploadingPath);

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