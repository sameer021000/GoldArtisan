import { useState, useRef, useEffect } from "react"

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

function ShopAddressBox_SA({ addressForm, setAddressForm, errors, setErrors, lockedState }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (lockedState && addressForm.state !== lockedState) {
      setAddressForm((prev) => ({ ...prev, state: lockedState }))
    }
  }, [lockedState, setAddressForm, addressForm.state])

  const validators = {
    state: (v) => (!v || !v.trim() ? "State is required" : ""),
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

  const handleFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }))
    const validator = validators[field]
    if (validator) {
      const err = validator(value)
      setErrors((prev) => ({ ...prev, [field]: err }))
    }
  }

  const getValidityAttrs = (field) => {
    const val = addressForm[field]
    const err = errors[field]
    if (err && err.length) return { "aria-invalid": "true", "aria-valid": "false" }
    if (val && !err) return { "aria-invalid": "false", "aria-valid": "true" }
    return { "aria-invalid": "false", "aria-valid": "false" }
  }

  const filteredStates = INDIAN_STATES.filter((state) => state.toLowerCase().includes(searchQuery.toLowerCase()))

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

  const isStateLocked = !!lockedState

  return (
    <div id="addressFormBox_ShopAddress">
      <div id="formHeaderRow_ShopAddress">
        <h2 id="formTitle_ShopAddress">Address Details</h2>
      </div>

      <div id="formGrid_ShopAddress">
        {/* State */}
        <div className="formGroup_ShopAddress" id="formGroup_State">
          <label htmlFor="input_State">
            State <span className="required">*</span>
          </label>
          <div
            id="selectWrapper_State"
            className={`customSelectWrapper ${isStateLocked ? "locked" : ""}`}
            ref={dropdownRef}
          >
            <button
              id="input_State"
              type="button"
              onClick={() => !isStateLocked && setIsDropdownOpen(!isDropdownOpen)}
              className={`customDropdownButton ${errors.state ? "error" : ""} ${isStateLocked ? "disabled" : ""}`}
              disabled={isStateLocked}
              {...getValidityAttrs("state")}
            >
              <span className={addressForm.state ? "" : "placeholder"}>{addressForm.state || "Select a state"}</span>
              {!isStateLocked && (
                <div className={`selectArrow ${isDropdownOpen ? "open" : ""}`} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              )}
            </button>
            {isDropdownOpen && !isStateLocked && (
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
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      type="button"
                      className={`dropdownOption ${addressForm.state === state ? "selected" : ""}`}
                      onClick={() => {
                        handleFormChange("state", state)
                        setIsDropdownOpen(false)
                        setSearchQuery("")
                      }}
                    >
                      {state}
                    </button>
                  ))}
                  {filteredStates.length === 0 && <div className="dropdownNoResults">No states found</div>}
                </div>
              </div>
            )}
          </div>
          <div id="err_State" className="err">
            {errors.state}
          </div>
        </div>

        {/* District */}
        <div className="formGroup_ShopAddress">
          <label htmlFor="input_District">
            District <span className="required">*</span>
          </label>
          <input
            id="input_District"
            type="text"
            className={`customInput ${errors.district ? "error" : ""}`}
            placeholder="Enter district"
            value={addressForm.district}
            onChange={(e) => handleFormChange("district", e.target.value)}
            {...getValidityAttrs("district")}
          />
          <div id="err_District" className="err">
            {errors.district}
          </div>
        </div>

        {/* Pin Code */}
        <div className="formGroup_ShopAddress">
          <label htmlFor="input_PinCode">
            PIN Code <span className="required">*</span>
          </label>
          <input
            id="input_PinCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={`customInput ${errors.pinCode ? "error" : ""}`}
            placeholder="Enter 6-digit PIN"
            value={addressForm.pinCode}
            onChange={(e) => handleFormChange("pinCode", e.target.value)}
            {...getValidityAttrs("pinCode")}
          />
          <div id="err_PinCode" className="err">
            {errors.pinCode}
          </div>
        </div>

        {/* City */}
        <div className="formGroup_ShopAddress">
          <label htmlFor="input_City">
            City <span className="required">*</span>
          </label>
          <input
            id="input_City"
            type="text"
            className={`customInput ${errors.city ? "error" : ""}`}
            placeholder="Enter city"
            value={addressForm.city}
            onChange={(e) => handleFormChange("city", e.target.value)}
            {...getValidityAttrs("city")}
          />
          <div id="err_City" className="err">
            {errors.city}
          </div>
        </div>

        {/* Center */}
        <div className="formGroup_ShopAddress">
          <label htmlFor="input_Center">
            Center <span className="required">*</span>
          </label>
          <input
            id="input_Center"
            type="text"
            className={`customInput ${errors.center ? "error" : ""}`}
            placeholder="Enter center name"
            value={addressForm.center}
            onChange={(e) => handleFormChange("center", e.target.value)}
            {...getValidityAttrs("center")}
          />
          <div id="err_Center" className="err">
            {errors.center}
          </div>
        </div>

        {/* Street */}
        <div className="formGroup_ShopAddress" id="formGroup_Street">
          <label htmlFor="input_Street">
            Street <span className="required">*</span>
          </label>
          <input
            id="input_Street"
            type="text"
            className={`customInput ${errors.street ? "error" : ""}`}
            placeholder="Enter street name"
            value={addressForm.street}
            onChange={(e) => handleFormChange("street", e.target.value)}
            {...getValidityAttrs("street")}
          />
          <div id="err_Street" className="err">
            {errors.street}
          </div>
        </div>

        {/* Landmark */}
        <div className="formGroup_ShopAddress" id="formGroup_Landmark">
          <label htmlFor="input_Landmark">
            Landmark <span className="required">*</span>
          </label>
          <input
            id="input_Landmark"
            type="text"
            className={`customInput ${errors.landmark ? "error" : ""}`}
            placeholder="Nearby landmark"
            value={addressForm.landmark}
            onChange={(e) => handleFormChange("landmark", e.target.value)}
            {...getValidityAttrs("landmark")}
          />
          <div id="err_Landmark" className="err">
            {errors.landmark}
          </div>
        </div>

        {/* Door No */}
        <div className="formGroup_ShopAddress">
          <label htmlFor="input_DoorNo">
            Door No <span className="required">*</span>
          </label>
          <input
            id="input_DoorNo"
            type="text"
            className={`customInput ${errors.doorNo ? "error" : ""}`}
            placeholder="Enter door/house number"
            value={addressForm.doorNo}
            onChange={(e) => handleFormChange("doorNo", e.target.value)}
            {...getValidityAttrs("doorNo")}
          />
          <div id="err_DoorNo" className="err">
            {errors.doorNo}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopAddressBox_SA
