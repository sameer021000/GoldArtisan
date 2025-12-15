function TemporaryAddressBox({
    isFormMinimized,
    setIsFormMinimized,
    addressForm,
    errors,
    getValidityAttrs,
    handleFormChange,
    dropdownRef,
    isDropdownOpen,
    setIsDropdownOpen,
    searchQuery,
    setSearchQuery,
    filteredStates,
    handleStateSelect,
  }) {
    return (
      <div id="addressFormBox_AddressQuestions">
        <div id="formHeaderRow_AddressQuestions">
          <h2 id="formTitle_AddressQuestions">Temporary Address Details</h2>
          <button
            id="toggleFormBtn_AddressQuestions"
            type="button"
            onClick={() => setIsFormMinimized(!isFormMinimized)}
                aria-label={isFormMinimized ? "Maximize form" : "Minimize form"}
                aria-expanded={!isFormMinimized}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              {isFormMinimized ? (
                <polyline points="6 9 12 15 18 9" />
              ) : (
                <polyline points="18 15 12 9 6 15" />
              )}
            </svg>
          </button>
        </div>
  
        {!isFormMinimized && (
          <div id="formContentWrapper_AddressQuestions">
            <div id="formGrid_AddressQuestions">
                {/* State Dropdown */}
                <div id="formGroup_State" className="formGroup_AddressQuestions">
                    <label id="label_State" htmlFor="input_State">
                      State <span className="required">*</span>
                    </label>
                    <div id="selectWrapper_State" className="customSelectWrapper" ref={dropdownRef}>
                      <button
                        id="input_State"
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={errors.state ? "customDropdownButton error" : "customDropdownButton"}
                        {...getValidityAttrs("state")}
                      >
                        <span className={addressForm.state ? "" : "placeholder"}>
                          {addressForm.state || "Select a state"}
                        </span>
                        <div className={`selectArrow ${isDropdownOpen ? "open" : ""}`} aria-hidden="true">
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

                      {isDropdownOpen && (
                        <div className="customDropdownMenu">
                          <div className="dropdownSearchWrapper">
                            <input
                              type="text"
                              className="dropdownSearch"
                              placeholder="Search states..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="dropdownOptions">
                            {filteredStates.length > 0 ? (
                              filteredStates.map((state) => (
                                <button
                                  key={state}
                                  type="button"
                                  className={`dropdownOption ${addressForm.state === state ? "selected" : ""}`}
                                  onClick={() => handleStateSelect(state)}
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
                    <div id="help_State" className="helper">
                      Select your state from the dropdown
                    </div>
                    <div id="err_State" className="err" role="alert" aria-live="polite">
                      {errors.state}
                    </div>
                  </div>

                  {/* District */}
                  <div id="formGroup_District" className="formGroup_AddressQuestions">
                    <label id="label_District" htmlFor="input_District">
                      District <span className="required">*</span>
                    </label>
                    <input
                      id="input_District"
                      type="text"
                      placeholder="Enter district"
                      value={addressForm.district}
                      onChange={(e) => handleFormChange("district", e.target.value)}
                      className={errors.district ? "customInput error" : "customInput"}
                      {...getValidityAttrs("district")}
                    />
                    <div id="help_District" className="helper">
                      Enter district name(letters only, single word—no spaces)
                    </div>
                    <div id="err_District" className="err" role="alert" aria-live="polite">
                      {errors.district}
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div id="formGroup_PinCode" className="formGroup_AddressQuestions">
                    <label id="label_PinCode" htmlFor="input_PinCode">
                      PIN Code <span className="required">*</span>
                    </label>
                    <input
                      id="input_PinCode"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter PIN code"
                      maxLength={6}
                      value={addressForm.pinCode}
                      onChange={(e) => handleFormChange("pinCode", e.target.value)}
                      className={errors.pinCode ? "customInput error" : "customInput"}
                      {...getValidityAttrs("pinCode")}
                    />
                    <div id="help_PinCode" className="helper">
                      Enter 6-digit PIN code
                    </div>
                    <div id="err_PinCode" className="err" role="alert" aria-live="polite">
                      {errors.pinCode}
                    </div>
                  </div>

                  {/* City */}
                  <div id="formGroup_City" className="formGroup_AddressQuestions">
                    <label id="label_City" htmlFor="input_City">
                      City <span className="required">*</span>
                    </label>
                    <input
                      id="input_City"
                      type="text"
                      placeholder="Enter city"
                      value={addressForm.city}
                      onChange={(e) => handleFormChange("city", e.target.value)}
                      className={errors.city ? "customInput error" : "customInput"}
                      {...getValidityAttrs("city")}
                    />
                    <div id="help_City" className="helper">
                      Enter your city name
                    </div>
                    <div id="err_City" className="err" role="alert" aria-live="polite">
                      {errors.city}
                    </div>
                  </div>

                  {/* Center */}
                  <div id="formGroup_Center" className="formGroup_AddressQuestions">
                    <label id="label_Center" htmlFor="input_Center">
                      Center <span className="required">*</span>
                    </label>
                    <input
                      id="input_Center"
                      type="text"
                      placeholder="Enter center"
                      value={addressForm.center}
                      onChange={(e) => handleFormChange("center", e.target.value)}
                      className={errors.center ? "customInput error" : "customInput"}
                      {...getValidityAttrs("center")}
                    />
                    <div id="help_Center" className="helper">
                      Enter center name(letters only, single word—no spaces)
                    </div>
                    <div id="err_Center" className="err" role="alert" aria-live="polite">
                      {errors.center}
                    </div>
                  </div>

                  {/* Street */}
                  <div id="formGroup_Street" className="formGroup_AddressQuestions">
                    <label id="label_Street" htmlFor="input_Street">
                      Street <span className="required">*</span>
                    </label>
                    <input
                      id="input_Street"
                      type="text"
                      placeholder="Enter street"
                      value={addressForm.street}
                      onChange={(e) => handleFormChange("street", e.target.value)}
                      className={errors.street ? "customInput error" : "customInput"}
                      {...getValidityAttrs("street")}
                    />
                    <div id="help_Street" className="helper">
                      Enter your street name
                    </div>
                    <div id="err_Street" className="err" role="alert" aria-live="polite">
                      {errors.street}
                    </div>
                  </div>

                  {/* Landmark */}
                  <div id="formGroup_Landmark" className="formGroup_AddressQuestions">
                    <label id="label_Landmark" htmlFor="input_Landmark">
                      Landmark <span className="required">*</span>
                    </label>
                    <input
                      id="input_Landmark"
                      type="text"
                      placeholder="Enter landmark"
                      value={addressForm.landmark}
                      onChange={(e) => handleFormChange("landmark", e.target.value)}
                      className={errors.landmark ? "customInput error" : "customInput"}
                      {...getValidityAttrs("landmark")}
                    />
                    <div id="help_Landmark" className="helper">
                      Enter a nearby landmark
                    </div>
                    <div id="err_Landmark" className="err" role="alert" aria-live="polite">
                      {errors.landmark}
                    </div>
                  </div>

                  {/* Door Number */}
                  <div id="formGroup_DoorNo" className="formGroup_AddressQuestions">
                    <label id="label_DoorNo" htmlFor="input_DoorNo">
                      D.No <span className="required">*</span>
                    </label>
                    <input
                      id="input_DoorNo"
                      type="text"
                      placeholder="Enter door number"
                      value={addressForm.doorNo}
                      onChange={(e) => handleFormChange("doorNo", e.target.value)}
                      className={errors.doorNo ? "customInput error" : "customInput"}
                      {...getValidityAttrs("doorNo")}
                    />
                    <div id="help_DoorNo" className="helper">
                      Enter door/house number
                    </div>
                    <div id="err_DoorNo" className="err" role="alert" aria-live="polite">
                      {errors.doorNo}
                    </div>
                  </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  export default TemporaryAddressBox;  