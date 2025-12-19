const express = require("express");
const GAAddressSavingSchema = require("../SchemaFolder/GAAddressSavingSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");
const { validateAddress } = require("../Validators/AddressValidator");

const router = express.Router();

router.post("/saveGAAddress", AuthenticationController.isAuthenticated, async (req, res) =>
{
    try
    {
        const
        {
            phoneNumber,
            hasPermanentAddress,
            addressesSame,
            temporaryAddress,
            permanentAddress,
        } = req.body;

        // 🔐 Token safety check
        if (!req.user || req.user.PhoneNumber !== phoneNumber)
        {
            return res.status(403).json(
            {
                success: false,
                message: "Token phone number mismatch",
            });
        }

        if (typeof hasPermanentAddress !== "boolean")
        {
            return res.status(400).json(
            {
                success: false,
                message: "hasPermanentAddress must be boolean",
            });
        }

        // Case 1: No permanent address → temporary only
        if (hasPermanentAddress === false)
        {
            const tempErrors = validateAddress(temporaryAddress, "Temporary address");
            if (tempErrors)
            {
                return res.status(400).json(
                {
                    success: false,
                    message: "Temporary address validation failed",
                    errors: tempErrors,
                });
            }
        }

        // Case 2: Permanent = Same
        if (hasPermanentAddress === true && addressesSame === true)
        {
            const permErrors = validateAddress(permanentAddress, "Permanent address");
            if (permErrors)
            {
                return res.status(400).json(
                {
                    success: false,
                    message: "Permanent address validation failed",
                    errors: permErrors,
                });
            }
        }

        // Case 3: Permanent ≠ Temporary
        if (hasPermanentAddress === true && addressesSame === false)
        {
            const tempErrors = validateAddress(temporaryAddress, "Temporary address");
            const permErrors = validateAddress(permanentAddress, "Permanent address");

            if (tempErrors || permErrors)
            {
                return res.status(400).json(
                {
                    success: false,
                    message: "Address validation failed",
                    errors:
                    {
                        ...(tempErrors ? { temporaryAddress: tempErrors } : {}),
                        ...(permErrors ? { permanentAddress: permErrors } : {}),
                    },
                });
            }
        }

        // SAVE DATA
        const addressData =
        {
            PhoneNumber: phoneNumber,
            HasPermanentAddress: hasPermanentAddress,
            IsPermanentAndTemporaryAddressSame: hasPermanentAddress ? addressesSame : null,
            TemporaryAddress: temporaryAddress || null,
            PermanentAddress: permanentAddress || null,
        };

        const savedAddress = await GAAddressSavingSchema.findOneAndUpdate(
            { PhoneNumber: phoneNumber },
            addressData,
            {
                new: true, 
                upsert: true, 
                runValidators: true
            }
        );

        return res.status(200).json(
        {
            success: true,
            message: "Address details saved successfully",
            data: savedAddress,
        });
    }
    catch (err)
    {
        console.error("Address save error:", err);
        return res.status(500).json(
        {
            success: false,
            message: "Server error while saving address details",
        });
    }
  }
);
module.exports = router;