const express = require("express");
const TypesOfWorkSchema = require("../SchemaFolder/TypesOfWorksSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");
const { validateTypesOfWorks } = require("../Validators/TypesOfWorksValidator");

const router = express.Router();

router.post("/saveGATypesOfWorks", AuthenticationController.isAuthenticated, async (req, res) =>
{
    try
    {
        const
        {
            phoneNumber,
            worksWithSilver,
            worksWithGold,
            typesOfWorks,
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
        // Boolean validations
        if (typeof worksWithSilver !== "boolean")
        {
            return res.status(400).json(
            {
                success: false,
                message: "worksWithSilver must be boolean",
            });
        }
        if (typeof worksWithGold !== "boolean")
        {
            return res.status(400).json(
            {
                success: false,
                message: "worksWithGold must be boolean",
            });
        }
        // Types of works validation
        const typeErrors = validateTypesOfWorks(typesOfWorks);
        if (typeErrors)
        {
            return res.status(400).json(
            {
                success: false,
                message: "Types of work validation failed",
                errors: typeErrors,
            });
        }
        // SAVE DATA
        const dataToSave =
        {
            PhoneNumber : phoneNumber,
            WorksWithSilver : worksWithSilver,
            WorksWithGold : worksWithGold,
            TypesOfWorks : typesOfWorks,
        };
        const savedData = await TypesOfWorkSchema.findOneAndUpdate(
            { phoneNumber },
            dataToSave,
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );
        return res.status(200).json(
        {
            success: true,
            message: "Types of work saved successfully",
            data: savedData,
        });
    }
    catch (err)
    {
        console.error("TypesOfWorks save error:", err);
        return res.status(500).json(
        {
            success: false,
            message: "Server error while saving types of work",
        });
    }
}
);

module.exports = router;