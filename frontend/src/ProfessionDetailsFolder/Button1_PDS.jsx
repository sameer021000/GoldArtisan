function Button1_PDS(
{
  worksWithSilver,
  worksWithGold,
  specialties,
  canSubmit,
  isSubmitting,
  handleSubmit,
  submitError,
  submitSuccess,
})
{
  if (
    worksWithSilver === null &&
    worksWithGold === null &&
    specialties.length === 0
  ) {
    return null
  }

  return (
    <div id="submitButtonContainer_ProfessionDetails">
      <button
        id="submitBtn_ProfessionDetails"
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </button>

      {submitError && (
        <div className="submit-message error">{submitError}</div>
      )}

      {submitSuccess && (
        <div className="submit-message success">
          Profession details saved successfully
        </div>
      )}
    </div>
  )
}

export default Button1_PDS;