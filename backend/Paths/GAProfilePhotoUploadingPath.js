const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();
const AuthenticationController = require('../Authentication/AuthenticationController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const phone = (req.user && req.user.PhoneNumber) ? req.user.PhoneNumber.replace(/\D/g, '') : 'anon';
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${phone}-${Date.now()}${ext}`);
  }
});

// only accept png/jpeg
const fileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only PNG/JPG allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /Operations/uploadProfilePhoto
router.post('/uploadGAProfilePhotoPath', AuthenticationController.isAuthenticated, function (req, res, next) {
  const singleUpload = upload.single('profilePhoto');

  singleUpload(req, res, async function (err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: err.message || 'File upload error' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const photoUrl = `/uploads/${req.file.filename}`;

      const phoneNumber = req.user && req.user.PhoneNumber;
      if (!phoneNumber) {
        // optional: remove file if desired
        return res.status(400).json({ success: false, message: 'Invalid token payload' });
      }

      const artisan = await UnVerifiedGASchema.findOne({ PhoneNumber: phoneNumber });
      if (!artisan) {
        return res.status(404).json({ success: false, message: 'Artisan not found' });
      }

      artisan.ProfilePhotoUrl = photoUrl;
      await artisan.save();

      return res.status(200).json({
        success: true,
        message: 'Profile photo uploaded successfully',
        photoUrl: photoUrl
      });

    } catch (e) {
      console.error('Upload processing error:', e);
      return res.status(500).json({ success: false, message: 'Server error while processing upload' });
    }
  });
});

module.exports=router;
