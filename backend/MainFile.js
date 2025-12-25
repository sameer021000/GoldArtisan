require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
const gaAddressDetailsPath=require('./Paths/GAAddressDetailsPath');
const gaTypesOfWorksSavingPath=require('./Paths/GATypesOfWorksSavingPath');
const gaTypesOfWorksDetailsGettingPath=require('./Paths/GATypesOfWorksGettingPath');

app.use('/GASignUpPath', gaSignUpPath);
app.use('/GASignInPath', gaSignInPath);
app.use('/GADetailsGettingPath', gaDetailsGettingPath);
app.use('/GAProfilePhotoUploadingPath', gaProfilePhotoUploadingPath);
app.use('/GAAddressDetailsPath', gaAddressDetailsPath);
app.use('/GATypesOfWorksSavingPath', gaTypesOfWorksSavingPath);
app.use('/GATypesOfWorksDetailsGettingPath', gaTypesOfWorksDetailsGettingPath);

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
