const express = require("express");
const WorkExperienceSchema = require("../SchemaFolder/WorkExperienceSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");
const { validateWorkExperience } = require("../Validators/WorkExperienceValidator");

const router = express.Router();

router.post("/saveGAWorkExperience",  AuthenticationController.isAuthenticated,  async (req, res) =>
{
    try
    {
        const
        {
            phoneNumber,
            experiences,
            typesOfWorks,
            worksWithGold,
            worksWithSilver,
        } = req.body;

        /* =========================
           TOKEN SAFETY CHECK
        ========================= */
        if (!req.user || req.user.PhoneNumber !== phoneNumber)
        {
            return res.status(403).json(
            {
                success: false,
                message: "Token phone number mismatch",
            });
        }

        /* =========================
           BASIC STRUCTURE CHECKS
        ========================= */
        if (!Array.isArray(experiences))
        {
            return res.status(400).json(
            {
                success: false,
                message: "experiences must be an array",
            });
        }

        if (!Array.isArray(typesOfWorks))
        {
            return res.status(400).json(
            {
                success: false,
                message: "TypesOfWorks must be an array",
            });
        }

        if (typeof worksWithGold !== "boolean")
        {
            return res.status(400).json(
            {
                success: false,
                message: "WorksWithGold must be boolean",
            });
        }

        if (typeof worksWithSilver !== "boolean")
        {
            return res.status(400).json(
            {
                success: false,
                message: "WorksWithSilver must be boolean",
            });
        }

        /* =========================
           VALIDATION (BUSINESS LOGIC)
        ========================= */
        const validationError = validateWorkExperience(
        {
            PhoneNumber: phoneNumber,
            Experiences: experiences,
            TypesOfWorks: typesOfWorks,
            WorksWithGold: worksWithGold,
            WorksWithSilver: worksWithSilver,
        });

        if (validationError)
        {
            return res.status(400).json(
            {
                success: false,
                message: validationError,
            });
        }

        /* =========================
           DATA TO SAVE
        ========================= */
        const dataToSave =
        {
            PhoneNumber: phoneNumber,
            Experiences: experiences,
        };

        const savedData = await WorkExperienceSchema.findOneAndUpdate(
            { PhoneNumber: phoneNumber },
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
            message: "Work experience saved successfully",
            data: savedData,
        });
    }
    catch (err)
    {
        console.error("WorkExperience save error:", err);
        return res.status(500).json(
        {
            success: false,
            message: "Server error while saving work experience",
        });
    }
  }
);

module.exports = router;
