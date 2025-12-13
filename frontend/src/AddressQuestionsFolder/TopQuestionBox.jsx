function TopQuestionBox({ hasPermanentAddress, onYes, onNo }) {
    return (
      <div id="topBox_AddressQuestions">
        <h1 id="h1Id1_AddressQuestions">Answer few questions</h1>
        <p id="pId1_AddressQuestions">
          Please answer the following questions about your address details
        </p>
  
        <h2 id="questionTitle_AddressQuestions">
          Do you have a permanent address?
        </h2>
  
        <div id="buttonGroup_AddressQuestions">
          <button
            id="yesBtn_AddressQuestions"
            type="button"
            className={hasPermanentAddress === true ? "selectedOption" : ""}
            onClick={onYes}
            aria-pressed={hasPermanentAddress === true}
          >
            <div id="yesIcon_AddressQuestions" aria-hidden="true">✓</div>
            <span>Yes</span>
          </button>
  
          <button
            id="noBtn_AddressQuestions"
            type="button"
            className={hasPermanentAddress === false ? "selectedOption" : ""}
            onClick={onNo}
            aria-pressed={hasPermanentAddress === false}
          >
            <div id="noIcon_AddressQuestions" aria-hidden="true">✕</div>
            <span>No</span>
          </button>
        </div>
      </div>
    )
  }
  
  export default TopQuestionBox;  