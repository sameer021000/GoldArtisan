function ShopAddressSavingButton_SA({ isSubmitting, submitError, submitSuccess, onSubmit }) {
  return (
    <div id="submitButtonContainer_ShopAddress">
      <button id="submitBtn_ShopAddress" type="button" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
      {submitError && (
        <div id="submitError_ShopAddress" className="submit-message error">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div id="submitSuccess_ShopAddress" className="submit-message success">
          Shop address saved successfully!
        </div>
      )}
    </div>
  )
}

export default ShopAddressSavingButton_SA
