const mongoose=require("mongoose");
const typesOfWorksSchemaStructure=new mongoose.Schema(
{
    PhoneNumber :
    {
        type : String,
        required : true,
        unique : true
    },
    WorksWithSilver :
    {
        type : Boolean,
        required : true
    },
    WorksWithGold:
    {
        type : Boolean,
        required : true
    },
    TypesOfWorks:
    {
        type: [String],   // 👈 array of selected specialties
        required: true,
        validate:
        {
            validator: function (v)
            {
                return Array.isArray(v) && v.length > 0;
            },
            message: "At least one type of work is required"
        }
    }
});
module.exports=mongoose.model("TypesOfWorksSchema", typesOfWorksSchemaStructure, "TypesOfWorksCollection");
