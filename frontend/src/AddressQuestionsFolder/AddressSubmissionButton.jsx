function AddressSubmissionButton({ isVisible }) {
  if (!isVisible) return null

  return (
    <div id="submitButtonContainer_AddressQuestions">
      <button id="submitBtn_AddressQuestions" type="button" disabled aria-disabled="true">
        Submit
      </button>
    </div>
  )
}

export default AddressSubmissionButton
