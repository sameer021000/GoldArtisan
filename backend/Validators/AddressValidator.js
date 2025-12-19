const alphaSpaceRegex = /^[A-Za-z\s]+$/;

const validateAddress = (address, label = "Address") =>
{
    if (!address || typeof address !== "object")
    {
        return `${label} is missing`;
    }

    const errors = {};

    // state
    if (!address.state || !address.state.trim())
    {
        errors.state = "State is required";
    }

    // district
    const district = address.district || "";
    if (!district.trim())
    {
        errors.district = "District is required.";
    }
    else if (district.charAt(0) === " ")
    {
        errors.district = "District cannot start with a space";
    }
    else if (!alphaSpaceRegex.test(district))
    {
        errors.district = "District must contain letters only(no digits/symbols)";
    }

    // pinCode
    const pinCode = address.pinCode || "";
    if (!pinCode.trim())
    {
        errors.pinCode = "PIN Code is required";
    }
    else
    {
        const digits = pinCode.replace(/\D/g, "");
        if (digits.length !== 6)
        {
            errors.pinCode = "PIN Code must be exactly 6 digits";
        }
    }

    // city (NOT required, but validated if present)
    const city = address.city || "";
    if (city.charAt(0) === " ")
    {
        errors.city = "City cannot start with a space";
    }
    else if (city && !alphaSpaceRegex.test(city))
    {
        errors.city = "City must contain letters only(no digits/symbols)";
    }

    // center
    const center = address.center || "";
    if (!center.trim())
    {
        errors.center = "Center is required";
    }
    else if (center.charAt(0) === " ")
    {
        errors.center = "Center cannot start with a space";
    }
    else if (!alphaSpaceRegex.test(center))
    {
        errors.center = "Center must contain letters only(no digits/symbols)";
    }

    // street
    const street = address.street || "";
    if (!street.trim())
    {
        errors.street = "Street is required";
    }
    else if (street.charAt(0) === " ")
    {
        errors.street = "Street cannot start with a space";
    }
    else if (!alphaSpaceRegex.test(street))
    {
        errors.street = "Street must contain letters only(no digits/symbols)";
    }

    // landmark
    const landmark = address.landmark || "";
    if (!landmark.trim())
    {
        errors.landmark = "Landmark is required";
    }
    else if (landmark.charAt(0) === " ")
    {
        errors.landmark = "Landmark cannot start with a space";
    }

    // doorNo
    const doorNo = address.doorNo || "";
    if (!doorNo.trim())
    {
        errors.doorNo = "Door number is required";
    }
    else if (doorNo.charAt(0) === " ")
    {
        errors.doorNo = "Door number cannot start with a space";
    }

    return Object.keys(errors).length ? errors : null;
};

module.exports =
{
    validateAddress,
};