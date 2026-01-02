const mongoose=require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    pinCode: { type: String, default: "" },
    city: { type: String, default: "" },
    center: { type: String, default: "" },
    street: { type: String, default: "" },
    landmark: { type: String, default: "" },
    doorNo: { type: String, default: "" },
  },
  { _id: false }
);
const gaAddressSavingSchemaStructure=new mongoose.Schema(
    {
        PhoneNumber :
        {
            type : String,
            required : true,
            unique : true
        },
        HasPermanentAddress :
        {
            type : Boolean,
            required : true
        },
        IsPermanentAndTemporaryAddressSame:
        {
            type : Boolean,
            default: null
        },
        TemporaryAddress:
        {
            type : addressSchema,
            default: null
        },
        PermanentAddress:
        {
            type : addressSchema,
            default: null
        }
    }
);
module.exports=mongoose.model(
    "AddressSavingSchema", 
    gaAddressSavingSchemaStructure, 
    "AddressSavingCollection"
);
