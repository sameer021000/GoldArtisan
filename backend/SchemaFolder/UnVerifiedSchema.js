const mongoose=require("mongoose");
const unVerifiedSchemaStructure=new mongoose.Schema(
    {
        FirstName :
        {
            type : String,
            required : true
        },
        LastName :
        {
            type : String,
            required : true
        },
        PhoneNumber :
        {
            type : String,
            required : true,
            unique : true
        },
        Password :
        {
            type : String,
            required : true
        }
    }
);
module.exports=mongoose.model("UnVerifiedSchema", unVerifiedSchemaStructure, "UnVerifiedCollection");