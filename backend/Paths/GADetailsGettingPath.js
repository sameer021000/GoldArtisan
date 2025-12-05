const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();
const AuthenticationController = require('../Authentication/AuthenticationController');

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
    const artisan = await UnVerifiedGASchema.findOne({ PhoneNumber: phoneNumber }).select('FirstName LastName PhoneNumber ProfilePhotoUrl').lean();

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

module.exports=router;