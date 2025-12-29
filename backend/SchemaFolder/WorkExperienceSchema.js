const mongoose = require("mongoose");

const workExperienceSchemaStructure = new mongoose.Schema(
{
    PhoneNumber:
    {
        type: String,
        required: true,
        unique: true   // one experience document per artisan
    },

    Experiences:
    [
        {
            WorkType:
            {
                type: String,
                required: true
            },

            GoldMonths:
            {
                type: Number,
                required: true,
                min: 0
            },

            SilverMonths:
            {
                type: Number,
                required: true,
                min: 0
            }
        }
    ]
},
{
    timestamps: true   // adds createdAt & updatedAt automatically
});

module.exports = mongoose.model(
    "WorkExperienceSchema",
    workExperienceSchemaStructure,
    "WorkExperienceCollection"
);