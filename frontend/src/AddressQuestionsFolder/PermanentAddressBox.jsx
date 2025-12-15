function PermanentAddressBox({
    isPermanentFormMinimized,
    setIsPermanentFormMinimized,
    permanentAddressForm,
    permanentErrors,
    getPermanentValidityAttrs,
    handlePermanentFormChange,
    permanentDropdownRef,
    isPermanentDropdownOpen,
    setIsPermanentDropdownOpen,
    permanentSearchQuery,
    setPermanentSearchQuery,
    filteredPermanentStates,
    handlePermanentStateSelect,
  }) {
    return (
      <div id="permanentAddressFormBox_AddressQuestions">
        <div id="permanentFormHeaderRow_AddressQuestions">
          <h2 id="permanentFormTitle_AddressQuestions">
            Permanent Address Details
          </h2>
  
          <button
            id="togglePermanentFormBtn_AddressQuestions"
            type="button"
            onClick={() => setIsPermanentFormMinimized(!isPermanentFormMinimized)}
                aria-label={isPermanentFormMinimized ? "Maximize form" : "Minimize form"}
                aria-expanded={!isPermanentFormMinimized}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              {isPermanentFormMinimized ? (
                <polyline points="6 9 12 15 18 9" />
              ) : (
                <polyline points="18 15 12 9 6 15" />
              )}
            </svg>
          </button>
        </div>
  
        {!isPermanentFormMinimized && (
          <div id="permanentFormContentWrapper_AddressQuestions"
            className={isPermanentFormMinimized ? "formCollapsed" : "formExpanded"}
            aria-hidden={isPermanentFormMinimized}
          >
            <div id="permanentFormGrid_AddressQuestions">
                {/* State Dropdown */}
                <div id="permanentFormGroup_State" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_State" htmlFor="permanentInput_State">
                      State <span className="required">*</span>
                    </label>
                    <div id="permanentSelectWrapper_State" className="customSelectWrapper" ref={permanentDropdownRef}>
                      <button
                        id="permanentInput_State"
                        type="button"
                        onClick={() => setIsPermanentDropdownOpen(!isPermanentDropdownOpen)}
                        className={permanentErrors.state ? "customDropdownButton error" : "customDropdownButton"}
                        {...getPermanentValidityAttrs("state")}
                      >
                        <span className={permanentAddressForm.state ? "" : "placeholder"}>
                          {permanentAddressForm.state || "Select a state"}
                        </span>
                        <div className={`selectArrow ${isPermanentDropdownOpen ? "open" : ""}`} aria-hidden="true">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                      </button>

                      {isPermanentDropdownOpen && (
                        <div className="customDropdownMenu">
                          <div className="dropdownSearchWrapper">
                            <input
                              type="text"
                              className="dropdownSearch"
                              placeholder="Search states..."
                              value={permanentSearchQuery}
                              onChange={(e) => setPermanentSearchQuery(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="dropdownOptions">
                            {filteredPermanentStates.length > 0 ? (
                              filteredPermanentStates.map((state) => (
                                <button
                                  key={state}
                                  type="button"
                                  className={`dropdownOption ${permanentAddressForm.state === state ? "selected" : ""}`}
                                  onClick={() => handlePermanentStateSelect(state)}
                                >
                                  {state}
                                </button>
                              ))
                            ) : (
                              <div className="dropdownNoResults">No states found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div id="permanentHelp_State" className="helper">
                      Select your state from the dropdown
                    </div>
                    <div id="permanentErr_State" className="err" role="alert" aria-live="polite">
                      {permanentErrors.state}
                    </div>
                  </div>

                  {/* District */}
                  <div id="permanentFormGroup_District" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_District" htmlFor="permanentInput_District">
                      District <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_District"
                      type="text"
                      placeholder="Enter district"
                      value={permanentAddressForm.district}
                      onChange={(e) => handlePermanentFormChange("district", e.target.value)}
                      className={permanentErrors.district ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("district")}
                    />
                    <div id="permanentHelp_District" className="helper">
                      Enter district name (letters only, cannot start with space)
                    </div>
                    <div id="permanentErr_District" className="err" role="alert" aria-live="polite">
                      {permanentErrors.district}
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div id="permanentFormGroup_PinCode" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_PinCode" htmlFor="permanentInput_PinCode">
                      PIN Code <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_PinCode"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter PIN code"
                      maxLength={6}
                      value={permanentAddressForm.pinCode}
                      onChange={(e) => handlePermanentFormChange("pinCode", e.target.value)}
                      className={permanentErrors.pinCode ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("pinCode")}
                    />
                    <div id="permanentHelp_PinCode" className="helper">
                      Enter 6-digit PIN code
                    </div>
                    <div id="permanentErr_PinCode" className="err" role="alert" aria-live="polite">
                      {permanentErrors.pinCode}
                    </div>
                  </div>

                  {/* City */}
                  <div id="permanentFormGroup_City" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_City" htmlFor="permanentInput_City">
                      City <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_City"
                      type="text"
                      placeholder="Enter city"
                      value={permanentAddressForm.city}
                      onChange={(e) => handlePermanentFormChange("city", e.target.value)}
                      className={permanentErrors.city ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("city")}
                    />
                    <div id="permanentHelp_City" className="helper">
                      Enter your city name (letters only, cannot start with space)
                    </div>
                    <div id="permanentErr_City" className="err" role="alert" aria-live="polite">
                      {permanentErrors.city}
                    </div>
                  </div>

                  {/* Center */}
                  <div id="permanentFormGroup_Center" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_Center" htmlFor="permanentInput_Center">
                      Center <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_Center"
                      type="text"
                      placeholder="Enter center"
                      value={permanentAddressForm.center}
                      onChange={(e) => handlePermanentFormChange("center", e.target.value)}
                      className={permanentErrors.center ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("center")}
                    />
                    <div id="permanentHelp_Center" className="helper">
                      Enter center name (letters only, cannot start with space)
                    </div>
                    <div id="permanentErr_Center" className="err" role="alert" aria-live="polite">
                      {permanentErrors.center}
                    </div>
                  </div>

                  {/* Street */}
                  <div id="permanentFormGroup_Street" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_Street" htmlFor="permanentInput_Street">
                      Street <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_Street"
                      type="text"
                      placeholder="Enter street"
                      value={permanentAddressForm.street}
                      onChange={(e) => handlePermanentFormChange("street", e.target.value)}
                      className={permanentErrors.street ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("street")}
                    />
                    <div id="permanentHelp_Street" className="helper">
                      Enter your street name (letters only, cannot start with space)
                    </div>
                    <div id="permanentErr_Street" className="err" role="alert" aria-live="polite">
                      {permanentErrors.street}
                    </div>
                  </div>

                  {/* Landmark */}
                  <div id="permanentFormGroup_Landmark" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_Landmark" htmlFor="permanentInput_Landmark">
                      Landmark <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_Landmark"
                      type="text"
                      placeholder="Enter landmark"
                      value={permanentAddressForm.landmark}
                      onChange={(e) => handlePermanentFormChange("landmark", e.target.value)}
                      className={permanentErrors.landmark ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("landmark")}
                    />
                    <div id="permanentHelp_Landmark" className="helper">
                      Enter a nearby landmark (cannot start with space)
                    </div>
                    <div id="permanentErr_Landmark" className="err" role="alert" aria-live="polite">
                      {permanentErrors.landmark}
                    </div>
                  </div>

                  {/* Door Number */}
                  <div id="permanentFormGroup_DoorNo" className="formGroup_AddressQuestions">
                    <label id="permanentLabel_DoorNo" htmlFor="permanentInput_DoorNo">
                      D.No <span className="required">*</span>
                    </label>
                    <input
                      id="permanentInput_DoorNo"
                      type="text"
                      placeholder="Enter door number"
                      value={permanentAddressForm.doorNo}
                      onChange={(e) => handlePermanentFormChange("doorNo", e.target.value)}
                      className={permanentErrors.doorNo ? "customInput error" : "customInput"}
                      {...getPermanentValidityAttrs("doorNo")}
                    />
                    <div id="permanentHelp_DoorNo" className="helper">
                      Enter door/house number (cannot start with space)
                    </div>
                    <div id="permanentErr_DoorNo" className="err" role="alert" aria-live="polite">
                      {permanentErrors.doorNo}
                    </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  export default PermanentAddressBox
  