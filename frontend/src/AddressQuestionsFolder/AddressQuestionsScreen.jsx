import React, { useState } from "react";
import "./AddressQuestionsCSS.css";

function AddressQuestionsScreen() {
  const [hasPermanentAddress, setHasPermanentAddress] = useState(null);

  const handleYesClick = () => {
    setHasPermanentAddress(true);
  };

  const handleNoClick = () => {
    setHasPermanentAddress(false);
  };

  return (
    <div id="divId1_AddressQuestions">
      <div id="contentWrap_AddressQuestions">
        <div id="mainPane_AddressQuestions">
          <h1 id="h1Id1_AddressQuestions">Answer few questions</h1>
          <p id="pId1_AddressQuestions">
            Please answer the following questions about your address details
          </p>

          {/* Question Card */}
          <div id="questionCard_AddressQuestions">
            <h2 id="questionTitle_AddressQuestions">
              Do you have a permanent address?
            </h2>

            {/* Yes/No Button Group */}
            <div id="buttonGroup_AddressQuestions">
              <button
                id="yesBtn_AddressQuestions"
                type="button"
                className={
                  hasPermanentAddress === true ? "selectedOption" : ""
                }
                onClick={handleYesClick}
                aria-pressed={hasPermanentAddress === true}
              >
                <div id="yesIcon_AddressQuestions" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span>Yes</span>
              </button>

              <button
                id="noBtn_AddressQuestions"
                type="button"
                className={
                  hasPermanentAddress === false ? "selectedOption" : ""
                }
                onClick={handleNoClick}
                aria-pressed={hasPermanentAddress === false}
              >
                <div id="noIcon_AddressQuestions" aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <span>No</span>
              </button>
            </div>

            {/* Selection feedback */}
            <div id="selectionFeedback_AddressQuestions" aria-live="polite">
              {hasPermanentAddress === true && (
                <span>You selected: Yes</span>
              )}
              {hasPermanentAddress === false && (
                <span>You selected: No</span>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div id="bottomRow_AddressQuestions">
            <button
              id="continueBtn_AddressQuestions"
              type="button"
              disabled={hasPermanentAddress === null}
              aria-disabled={hasPermanentAddress === null}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressQuestionsScreen;