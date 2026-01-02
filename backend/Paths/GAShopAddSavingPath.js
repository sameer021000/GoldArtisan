const express = require("express");
const GAShopAddressSavingSchema = require("../SchemaFolder/GAShopAddSavingSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");
const { validateAddress } = require("../Validators/AddressValidator");

const router = express.Router();

router.post("/saveGAShopAddress", AuthenticationController.isAuthenticated, async (req, res) =>
{
    try
    {
        const { phoneNumber, shopAddress } = req.body;
        
        /* 🔐 Token safety check */
        if (!req.user || req.user.PhoneNumber !== phoneNumber)
        {
            return res.status(403).json(
            {
                success: false,
                message: "Token phone number mismatch",
            });
        }

        /* Basic payload validation */
        if (!phoneNumber || typeof phoneNumber !== "string")
        {
            return res.status(400).json(
            {
                success: false,
                message: "Valid phoneNumber is required",
            });
        }

        /* Address validation (reuse existing validator) */
        const addressErrors = validateAddress(shopAddress, "Shop address");
        if (addressErrors)
        {
            return res.status(400).json(
            {
                success: false,
                message: "Shop address validation failed",
                errors: addressErrors,
            });
        }

        // SAVE DATA
        const shopAddressData =
        {
            PhoneNumber: phoneNumber,
            ShopAddress: shopAddress,
        };
        const savedShopAddress =
        await GAShopAddressSavingSchema.findOneAndUpdate(
            { PhoneNumber: phoneNumber },
            shopAddressData,
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );
        return res.status(200).json(
        {
            success: true,
            message: "Shop address saved successfully",
            data: savedShopAddress,
        });
    }
    catch (err)
    {
        console.error("Shop address save error:", err);
        return res.status(500).json(
        {
            success: false,
            message: "Server error while saving shop address",
        });
    }
});

module.exports = router;