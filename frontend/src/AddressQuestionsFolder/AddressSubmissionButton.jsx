function AddressSubmissionButton({ isVisible, onSubmit, isSubmitting, submitError, submitSuccess }) {
  if (!isVisible) return null

  return (
    <div id="submitButtonContainer_AddressQuestions">
      <button
        id="submitBtn_AddressQuestions"
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      
      {submitError && (
        <div className="submit-message error" role="alert" aria-live="polite">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="submit-message success" role="status" aria-live="polite">
          Address details saved successfully!
        </div>
      )}
    </div>
  )
}

export default AddressSubmissionButton
