const express = require("express");
const GAAddressSavingSchema = require("../SchemaFolder/GAAddressSavingSchema");
const AuthenticationController = require("../Authentication/AuthenticationController");

const router = express.Router();

/**
 * GET artisan address details
 * Used by ShopAddress.jsx
 */
router.get(
  "/getGAAddress",
  AuthenticationController.isAuthenticated,
  async (req, res) => {
    try {
      // 🔐 phone number comes ONLY from token
      const phoneNumber = req.user && req.user.PhoneNumber;

      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Invalid token payload: missing phone number",
        });
      }

      const addressDetails = await GAAddressSavingSchema
        .findOne({ PhoneNumber: phoneNumber })
        .lean();

      if (!addressDetails) {
        return res.status(404).json({
          success: false,
          message: "Address details not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: addressDetails, // 🔹 RAW DATA (as requested)
      });
    } catch (err) {
      console.error("Address fetch error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching address details",
      });
    }
  }
);

module.exports = router;