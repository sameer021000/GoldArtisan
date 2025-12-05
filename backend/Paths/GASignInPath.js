const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();
const AuthService=require('../Authentication/AuthenticationService')

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

module.exports=router;