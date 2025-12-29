exports.validateWorkExperience = ({
  PhoneNumber,
  Experiences,
  TypesOfWorks,
  WorksWithGold,
  WorksWithSilver
}) => {

  if (!PhoneNumber) {
    return "Phone number is required."
  }

  if (!Array.isArray(Experiences)) {
    return "Experiences must be an array."
  }

  let hasAnyNonZeroExperience = false

  for (const exp of Experiences) {
    const {
      WorkType,
      GoldMonths = 0,
      SilverMonths = 0
    } = exp

    if (!WorkType || typeof WorkType !== "string") {
      return "Invalid work type."
    }

    if (!TypesOfWorks.includes(WorkType)) {
      return `Invalid work type: ${WorkType}`
    }

    if (typeof GoldMonths !== "number" || GoldMonths < 0 || GoldMonths > 240) {
      return `Invalid gold experience for ${WorkType}`
    }

    if (typeof SilverMonths !== "number" || SilverMonths < 0 || SilverMonths > 240) {
      return `Invalid silver experience for ${WorkType}`
    }

    if (!WorksWithGold && GoldMonths !== 0) {
      return "Gold experience provided but artisan does not work with gold."
    }

    if (!WorksWithSilver && SilverMonths !== 0) {
      return "Silver experience provided but artisan does not work with silver."
    }

    if (GoldMonths > 0 || SilverMonths > 0) {
      hasAnyNonZeroExperience = true
    }
  }

  if (!hasAnyNonZeroExperience) {
    return "At least one work type must have non-zero experience."
  }

  return null // ✅ valid
}