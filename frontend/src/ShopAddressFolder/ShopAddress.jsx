"use client"

import "./ShopAddressCSS.css"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../queries/useAuth"
import { useNavigate } from "react-router-dom"

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

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function ShopAddress() {
  const navigate = useNavigate()
  const { phoneNumber, isLoading: authLoading, isError: authError } = useAuth()

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lockedState, setLockedState] = useState(null)

  useEffect(() => {
    const fetchAddress = async () => {
      if (authLoading) return
      if (authError || !phoneNumber) {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("GoldArtisanToken")
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(`${apiBase}/GAAddressGettingPath/getGAAddress`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { phoneNumber },
        })

        if (response?.data?.success && response.data.data) {
          console.log("[v0] Shop address details retrieved successfully from backend")
          const data = response.data.data
          let stateToLock = null

          // Case-1 & Case-2: Priority given to Present Address if different from Permanent
          if (data.temporaryAddress?.state) {
            stateToLock = data.temporaryAddress.state
          } else if (data.permanentAddress?.state) {
            stateToLock = data.permanentAddress.state
          }

          if (stateToLock) {
            setLockedState(stateToLock)
            setAddressForm((prev) => ({ ...prev, state: stateToLock }))
          }
        }
      } catch (err) {
        console.error("Error fetching shop address:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAddress()
  }, [authLoading, authError, phoneNumber])

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

  const handleSubmit = async () => {
    setSubmitError("")
    setSubmitSuccess(false)

    const nextErrors = {}
    Object.keys(validators).forEach((key) => {
      nextErrors[key] = validators[key](addressForm[key])
    })
    setErrors(nextErrors)

    if (Object.values(nextErrors).some((v) => v !== "")) {
      setSubmitError("Please correct the highlighted fields")
      return
    }

    const token = localStorage.getItem("GoldArtisanToken")
    if (!token) {
      setSubmitError("Missing authentication token. Please sign in again")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        `${apiBase}/GAAddressDetailsPath/saveGAAddress`,
        {
          phoneNumber,
          shopAddress: { ...addressForm },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response?.data?.success) {
        setSubmitSuccess(true)
        setTimeout(() => navigate("/HomeScreenPath"), 800)
      } else {
        setSubmitError(response?.data?.message || "Failed to save address details")
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || "An error occurred while saving address details.")
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (isLoading) return <div className="loadingText">Loading shop address...</div>

  const isStateLocked = !!lockedState

  return (
    <div id="divId1_AddressQuestions">
      <div id="contentWrap_AddressQuestions">
        <div id="topBox_AddressQuestions">
          <h1 id="h1Id1_AddressQuestions">Shop Address</h1>
          <p id="pId1_AddressQuestions">Please provide the address of your shop or workshop location.</p>
        </div>

        <div id="addressFormBox_AddressQuestions">
          <div id="formHeaderRow_AddressQuestions">
            <h2 id="formTitle_AddressQuestions">Address Details</h2>
          </div>

          <div id="formGrid_AddressQuestions">
            {/* State */}
            <div className="formGroup_AddressQuestions" id="formGroup_State">
              <label htmlFor="input_State">
                State <span className="required">*</span>
              </label>
              <div className={`customSelectWrapper ${isStateLocked ? "locked" : ""}`} ref={dropdownRef}>
                <button
                  id="input_State"
                  type="button"
                  onClick={() => !isStateLocked && setIsDropdownOpen(!isDropdownOpen)}
                  className={`customDropdownButton ${errors.state ? "error" : ""} ${isStateLocked ? "disabled" : ""}`}
                  disabled={isStateLocked}
                  {...getValidityAttrs("state")}
                >
                  <span className={addressForm.state ? "" : "placeholder"}>
                    {addressForm.state || "Select a state"}
                  </span>
                  {!isStateLocked && (
                    <div className={`selectArrow ${isDropdownOpen ? "open" : ""}`}>
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
                          className="dropdownOption"
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
              <div id="err_State">{errors.state}</div>
            </div>

            {/* District */}
            <div className="formGroup_AddressQuestions">
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
              <div id="err_District">{errors.district}</div>
            </div>

            {/* Pin Code */}
            <div className="formGroup_AddressQuestions">
              <label htmlFor="input_PinCode">
                PIN Code <span className="required">*</span>
              </label>
              <input
                id="input_PinCode"
                type="text"
                maxLength={6}
                className={`customInput ${errors.pinCode ? "error" : ""}`}
                placeholder="Enter 6-digit PIN"
                value={addressForm.pinCode}
                onChange={(e) => handleFormChange("pinCode", e.target.value)}
                {...getValidityAttrs("pinCode")}
              />
              <div id="err_PinCode">{errors.pinCode}</div>
            </div>

            {/* City */}
            <div className="formGroup_AddressQuestions">
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
              <div id="err_City">{errors.city}</div>
            </div>

            {/* Center */}
            <div className="formGroup_AddressQuestions">
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
              <div id="err_Center">{errors.center}</div>
            </div>

            {/* Street */}
            <div className="formGroup_AddressQuestions" id="formGroup_Street">
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
              <div id="err_Street">{errors.street}</div>
            </div>

            {/* Landmark */}
            <div className="formGroup_AddressQuestions" id="formGroup_Landmark">
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
              <div id="err_Landmark">{errors.landmark}</div>
            </div>

            {/* Door No */}
            <div className="formGroup_AddressQuestions">
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
              <div id="err_DoorNo">{errors.doorNo}</div>
            </div>
          </div>

          <div id="submitButtonContainer_AddressQuestions">
            <button id="submitBtn_AddressQuestions" type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Shop Address"}
            </button>
            {submitError && <div className="submit-message error">{submitError}</div>}
            {submitSuccess && <div className="submit-message success">Shop address saved successfully!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopAddress
