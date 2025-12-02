const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();
const AuthenticationController = require('../Authentication/AuthenticationController');
const AuthService=require('../Authentication/AuthenticationService')
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

router.get('/getGAFullName', AuthenticationController.isAuthenticated, async (req, res) =>
{
  try
  {
    // req.user is set by isAuthenticated middleware
    const phoneNumber = req.user && req.user.PhoneNumber;
    if (!phoneNumber)
    {
      return res.status(400).json({ success: false, message: "Invalid token payload: missing phone number" });
    }

    // use lean() to get plain object and exclude password field
    const artisan = await UnVerifiedGASchema.findOne({ PhoneNumber: phoneNumber }).select('FirstName LastName PhoneNumber').lean();

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
        phoneNumber: artisan.PhoneNumber
      }
    });
  }
  catch (err)
  {
    console.error('Error in /getGAFullName:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

module.exports=router;