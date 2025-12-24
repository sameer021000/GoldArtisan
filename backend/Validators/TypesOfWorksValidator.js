const allowedCharsRegex = /^[a-zA-Z0-9\s&()]+$/;

const validateSingleWorkType = (value, index) =>
{
    const errors = [];

    if (typeof value !== "string")
    {
        errors.push(`Type of work at index ${index} must be a string`);
        return errors;
    }

    // Trailing space check
    if (value !== value.trimEnd())
    {
        errors.push("Work type should not end with a space");
    }

    const trimmed = value.trim();

    // Empty check
    if (!trimmed)
    {
        errors.push("Work type cannot be empty");
    }

    // Only numbers
    if (/^\d+$/.test(trimmed))
    {
        errors.push("Work type cannot contain only numbers");
    }

    // Word count > 4
    const words = trimmed.split(/\s+/);
    if (words.length > 4)
    {
        errors.push("Please enter a maximum of 4 words");
    }

    // Disallow word 'and'
    if (words.some(w => w.toLowerCase() === "and"))
    {
        errors.push("The word 'and' is not allowed");
    }

    // Special character check
    if (!allowedCharsRegex.test(trimmed))
    {
        errors.push("Special characters are not allowed (except &, (, ))");
    }

    return errors.length ? errors : null;
};

const validateTypesOfWorks = (typesOfWorks) =>
{
    if (!Array.isArray(typesOfWorks) || typesOfWorks.length === 0)
    {
        return { typesOfWorks: "At least one type of work is required" };
    }

    const errors = {};

    typesOfWorks.forEach((work, index) =>
    {
        const workErrors = validateSingleWorkType(work, index);
        if (workErrors)
        {
            errors[index] = workErrors;
        }
    });

    return Object.keys(errors).length ? errors : null;
};

module.exports =
{
    validateTypesOfWorks,
};