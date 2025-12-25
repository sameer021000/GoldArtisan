const express = require("express");
const TypesOfWorkSchema = require("../SchemaFolder/TypesOfWorksSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");

const router = express.Router();

router.get("/getGATypesOfWorksDetails",  AuthenticationController.isAuthenticated,  async (req, res) =>
{
    try
    {
      // 🔐 phone number comes from verified token
      const phoneNumber = req.user?.PhoneNumber;

      if (!phoneNumber)
      {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // 🔍 Fetch from DB
      const data = await TypesOfWorkSchema.findOne(
        { PhoneNumber: phoneNumber },
        {
          _id: 0,
          PhoneNumber: 1,
          WorksWithSilver: 1,
          WorksWithGold: 1,
          TypesOfWorks: 1,
        }
      );

      if (!data)
      {
        return res.status(404).json({
          success: false,
          message: "Profession details not found",
        });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }
    catch (err)
    {
      console.error("TypesOfWorks fetch error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching types of work",
      });
    }
  }
);

module.exports=router;
