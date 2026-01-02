const mongoose = require("mongoose");
const shopAddressSchema = new mongoose.Schema(
  {
    state: {type: String, default: "",},
    district: {type: String, default: "",},
    pinCode: {type: String, default: "",},
    city: {type: String, default: "",},
    center: {type: String, default: "",},
    street: {type: String, default: "",},
    landmark: {type: String, default: "",},
    doorNo: {type: String, default: "",},
  },
  { _id: false }
);
const gaShopAddressSavingSchemaStructure = new mongoose.Schema(
  {
    PhoneNumber:
    {
      type: String,
      required: true,
      unique: true,
    },
    ShopAddress:
    {
      type: shopAddressSchema,
      required: true,
    },
  }
);
module.exports = mongoose.model(
  "ShopAddressSavingSchema",
  gaShopAddressSavingSchemaStructure,
  "ShopAddressCollection"
);