function AddressSameQuestionBox({ addressesSame, onYes, onNo }) {
    return (
      <div id="secondBox_AddressQuestions">
        <h2 id="questionTitle2_AddressQuestions">
          Is your permanent address and temporary address are same?
        </h2>
  
        <div id="buttonGroup2_AddressQuestions">
          <button
            id="yesBtn2_AddressQuestions"
            type="button"
            className={addressesSame === true ? "selectedOption" : ""}
            onClick={onYes}
            aria-pressed={addressesSame === true}
          >
            <div id="yesIcon2_AddressQuestions" aria-hidden="true">✓</div>
            <span>Yes</span>
          </button>
  
          <button
            id="noBtn2_AddressQuestions"
            type="button"
            className={addressesSame === false ? "selectedOption" : ""}
            onClick={onNo}
            aria-pressed={addressesSame === false}
          >
            <div id="noIcon2_AddressQuestions" aria-hidden="true">✕</div>
            <span>No</span>
          </button>
        </div>
      </div>
    )
  }
  
  export default AddressSameQuestionBox;  