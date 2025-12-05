const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();
const AuthenticationController = require('../Authentication/AuthenticationController');
const AuthService=require('../Authentication/AuthenticationService')

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// existing signup route
router.post("/unVerifiedGASignUpPath", async(req, res)=>
{
    const {firstNameFFEnd, lastNameFFEnd, phoneNumberFFEnd, passwordFFEnd}=req.body;
    try
    {
        const existingPhoneNumber=await UnVerifiedGASchema.findOne({PhoneNumber : phoneNumberFFEnd});
        if(existingPhoneNumber)
        {
            return res.status(400).json(
            {
                success : false,
                message : "Phone Number already existed"
            }
            );
        }
        const newData=new UnVerifiedGASchema(
        {
            FirstName : firstNameFFEnd, 
            LastName : lastNameFFEnd, 
            PhoneNumber : phoneNumberFFEnd, 
            Password : passwordFFEnd
        });
        const saved=await newData.save();
        res.status(201).json(
        {
            success : true,
            message : "UnVerified Gold Artisan details got saved successfully",
            data : 
            {
                id : saved._id, 
                firstNameFFEnd : saved.FirstName, 
                lastNameFFEnd : saved.LastName, 
                phoneNumberFFEnd : saved.PhoneNumber, 
                passwordFFEnd : saved.Password
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json(
        {
            success : false,
            message : "Server error while saving the data"
        }
        );
    }
});

// existing sign-in route
router.post('/unVerifiedGASignInPath', async (req, res) =>
{
    const {phoneNumberFFEnd, passwordFFEnd}=req.body;
    try
    {
        const existingPhoneNumber=await UnVerifiedGASchema.findOne({PhoneNumber: phoneNumberFFEnd});
        if(!existingPhoneNumber)
        {
            return res.status(400).json(
            {
                success: false,
                message: "Account not registered with this phone number"
            });
        }
        if(existingPhoneNumber.Password !== passwordFFEnd)
        {
            return res.status(400).json(
            {
                success: false,
                message: "Invalid password"
            });
        }
        const token = AuthService.createToken({PhoneNumber: existingPhoneNumber.PhoneNumber});
        return res.status(200).json(
        {
            success: true,
            message: "Login successful",
            token: token
        });

    }
    catch(error)
    {
        return res.status(500).json(
        {
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

// get full name AND photo URL
router.get('/getGoldArtisanDetails', AuthenticationController.isAuthenticated, async (req, res) =>
{
  try
  {
    // req.user is set by isAuthenticated middleware
    const phoneNumber = req.user && req.user.PhoneNumber;
    if (!phoneNumber)
    {
      return res.status(400).json({ success: false, message: "Invalid token payload: missing phone number" });
    }

    // include PhotoUrl in the selected fields
    const artisan = await UnVerifiedGASchema.findOne({ PhoneNumber: phoneNumber }).select('FirstName LastName PhoneNumber PhotoUrl').lean();

    if (!artisan)
    {
      return res.status(404).json({ success: false, message: 'Artisan not found' });
    }

    return res.status(200).json({
      success: true,
      data:
      {
        firstName: artisan.FirstName,
        lastName: artisan.LastName,
        phoneNumber: artisan.PhoneNumber,
        photoUrl: artisan.ProfilePhotoUrl || ""
      }
    });
  }
  catch (err)
  {
    console.error('Error in /getGoldArtisanDetails:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

/**
 * NEW: upload profile photo
 * - protected by AuthenticationController.isAuthenticated
 * - accepts multipart/form-data field 'profilePhoto'
 * - saves file to /uploads and writes PhotoUrl into artisan doc (based on PhoneNumber from token)
 */

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
