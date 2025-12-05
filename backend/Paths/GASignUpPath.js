const express=require("express");
const UnVerifiedGASchema=require("../SchemaFolder/UnVerifiedSchema");
const router=express.Router();

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

module.exports=router;