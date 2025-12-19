const express=require("express");
const GAAddressSavingSchema=require("../SchemaFolder/GAAddressSavingSchema");
const router=express.Router();

// existing signup route
router.post("/saveGAAddress", async(req, res)=>
{
    const
    {
        phoneNumber, hasPermanentAddress, addressesSame, 
        temporaryAddress, permanentAddress
    }=req.body;
    try
    {
        if (!phoneNumber)
        {
            return res.status(400).json(
            {
                success: false,
                message: "Phone number is required",
            })
        }
        const addressData =
        {
            PhoneNumber: phoneNumber,
            HasPermanentAddress: hasPermanentAddress,
            IsPermanentAndTemporaryAddressSame: addressesSame,
            TemporaryAddress: temporaryAddress,
            PermanentAddress: permanentAddress
        }
        const savedAddress = await GAAddressSavingSchema.findOneAndUpdate(
            { PhoneNumber: phoneNumber }, // Find by phone number
            addressData, // Update with new data
            {
              new: true, // Return the updated document
              upsert: true, // Create if doesn't exist
              runValidators: true, // Run schema validators
            },
        )
        res.status(201).json(
        {
            success: true,
            message: "Address details saved successfully",
            data:
            {
              id: savedAddress._id,
              phoneNumber: savedAddress.PhoneNumber,
              hasPermanentAddress: savedAddress.HasPermanentAddress,
              addressesSame: savedAddress.IsPermanentAndTemporaryAddressSame,
              temporaryAddress: savedAddress.TemporaryAddress,
              permanentAddress: savedAddress.PermanentAddress,
            },
        })
    }
    catch (err)
    {
        console.error("Error saving address details:", err)
        res.status(500).json(
        {
            success: false,
            message: "Server error while saving address details",
        })
    }
});

module.exports=router;