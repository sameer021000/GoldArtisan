import { useState, useRef, useEffect } from "react"
import "./AddressQuestionsCSS.css"

// All Indian states for the dropdown
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

function AddressQuestionsScreen() {
  // State for first question
  const [hasPermanentAddress, setHasPermanentAddress] = useState(null)

  // State for second question (shown only if first is "Yes")
  const [addressesSame, setAddressesSame] = useState(null)

  // State for address form (shown only if first is "No")
  const [addressForm, setAddressForm] = useState({
    state: "",
    district: "",
    pinCode: "",
    city: "",
    center: "",
    street: "",
    landmark: "",
    doorNo: "",
  })

  const [errors, setErrors] = useState({
    state: "",
    district: "",
    pinCode: "",
    city: "",
    center: "",
    street: "",
    landmark: "",
    doorNo: "",
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  const validators = {
    state: (v) => {
      if (!v || !v.trim()) return "State is required"
      return ""
    },
    district: (v) => {
      const raw = v || ""
      if (!raw.trim()) return "District is required."
      if (raw.charAt(0) === " ") return "District cannot start with a space"
      if (!/^[A-Za-z\s]+$/.test(raw)) return "District must contain letters only(no digits/symbols)"
      return ""
    },
    pinCode: (v) => {
      if (!v || !v.trim()) return "PIN Code is required"
      const digits = v.replace(/\D/g, "")
      if (digits.length !== 6) return "PIN Code must be exactly 6 digits"
      return ""
    },
    city: (v) => {
      const raw = v || ""
      if (raw.charAt(0) === " ") return "City cannot start with a space"
      if (!/^[A-Za-z\s]+$/.test(raw)) return "City must contain letters only(no digits/symbols)"
      return ""
    },
    center: (v) => {
      const raw = v || ""
      if (!raw.trim()) return "Center is required"
      if (raw.charAt(0) === " ") return "Center cannot start with a space"
      if (!/^[A-Za-z\s]+$/.test(raw)) return "Center must contain letters only(no digits/symbols)"
      return ""
    },
    street: (v) => {
      const raw = v || ""
      if (!raw.trim()) return "Street is required"
      if (raw.charAt(0) === " ") return "Street cannot start with a space"
      if (!/^[A-Za-z\s]+$/.test(raw)) return "Street must contain letters only(no digits/symbols)"
      return ""
    },
    landmark: (v) => {
      const raw = v || ""
      if (!raw.trim()) return "Landmark is required"
      if (raw.charAt(0) === " ") return "Landmark cannot start with a space"
      return ""
    },
    doorNo: (v) => {
      const raw = v || ""
      if (!raw.trim()) return "Door number is required"
      if (raw.charAt(0) === " ") return "Door number cannot start with a space"
      return ""
    },
  }

  const handleYesClick = () => {
    setHasPermanentAddress(true)
    setAddressesSame(null) // Reset second question
  }

  const handleNoClick = () => {
    setHasPermanentAddress(false)
    setAddressesSame(null) // Reset second question
  }

  const handleAddressesSameYes = () => {
    setAddressesSame(true)
  }

  const handleAddressesSameNo = () => {
    setAddressesSame(false)
  }

  const handleFormChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Validate on change
    const validator = validators[field]
    if (validator) {
      const err = validator(value)
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const validateAll = () => {
    const next = {}
    Object.keys(validators).forEach((key) => {
      next[key] = validators[key](addressForm[key])
    })
    setErrors(next)
    const isValid = Object.values(next).every((v) => v === "")
    return { isValid, next }
  }

  const handleNextClick = () => {
    const { isValid, next } = validateAll()

    if (!isValid) {
      // Focus first invalid input
      const firstInvalid = Object.keys(next).find((k) => next[k])
      if (firstInvalid) {
        const id = `input_${firstInvalid.charAt(0).toUpperCase() + firstInvalid.slice(1)}`
        const el = document.getElementById(id)
        if (el) el.focus()
      }
      return
    }

    console.log("[v0] Address form submitted:", addressForm)
    // Add your navigation or submission logic here
  }

  const isFormValid = () => {
    return (
      addressForm.state &&
      addressForm.district &&
      addressForm.pinCode &&
      addressForm.city &&
      addressForm.center &&
      addressForm.street &&
      addressForm.landmark &&
      addressForm.doorNo &&
      !errors.state &&
      !errors.district &&
      !errors.pinCode &&
      !errors.city &&
      !errors.center &&
      !errors.street &&
      !errors.landmark &&
      !errors.doorNo
    )
  }

  const getValidityAttrs = (field) => {
    const val = addressForm[field]
    const err = errors[field]
    if (err && err.length) return { "aria-invalid": "true", "aria-valid": "false" }
    if (val && !err) return { "aria-invalid": "false", "aria-valid": "true" }
    return { "aria-invalid": "false", "aria-valid": "false" }
  }

  const handleStateSelect = (state) => {
    handleFormChange("state", state)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  const filteredStates = INDIAN_STATES.filter((state) => state.toLowerCase()
  .includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setSearchQuery("")
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div id="divId1_AddressQuestions">
      <div id="contentWrap_AddressQuestions">
        {/* Top Box - Initial Question */}
        <div id="topBox_AddressQuestions">
          <h1 id="h1Id1_AddressQuestions">Answer few questions</h1>
          <p id="pId1_AddressQuestions">Please answer the following questions about your address details</p>

          <h2 id="questionTitle_AddressQuestions">Do you have a permanent address?</h2>

          {/* Yes/No Button Group */}
          <div id="buttonGroup_AddressQuestions">
            <button
              id="yesBtn_AddressQuestions"
              type="button"
              className={hasPermanentAddress === true ? "selectedOption" : ""}
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
              className={hasPermanentAddress === false ? "selectedOption" : ""}
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
        </div>

        {/* Second Box - Shown when first answer is "Yes" */}
        {hasPermanentAddress === true && (
          <div id="secondBox_AddressQuestions">
            <h2 id="questionTitle2_AddressQuestions">Is your permanent address and temporary address are same?</h2>

            <div id="buttonGroup2_AddressQuestions">
              <button
                id="yesBtn2_AddressQuestions"
                type="button"
                className={addressesSame === true ? "selectedOption" : ""}
                onClick={handleAddressesSameYes}
                aria-pressed={addressesSame === true}
              >
                <div id="yesIcon2_AddressQuestions" aria-hidden="true">
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
                id="noBtn2_AddressQuestions"
                type="button"
                className={addressesSame === false ? "selectedOption" : ""}
                onClick={handleAddressesSameNo}
                aria-pressed={addressesSame === false}
              >
                <div id="noIcon2_AddressQuestions" aria-hidden="true">
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
          </div>
        )}

        {/* Address Form Box - Shown when first answer is "No" */}
        {hasPermanentAddress === false && (
          <div id="addressFormBox_AddressQuestions">
            <h2 id="formTitle_AddressQuestions">Enter your address details</h2>

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

            {/* Next Button inside form box */}
            <div id="formBottomRow_AddressQuestions">
              <button
                id="nextBtn_AddressQuestions"
                type="button"
                onClick={handleNextClick}
                disabled={!isFormValid()}
                aria-disabled={!isFormValid()}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressQuestionsScreen
