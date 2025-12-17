import { useState, useRef, useEffect } from "react"
import "./AddressQuestionsCSS.css"
import TopQuestionBox from "./TopQuestionBox"
import AddressSameQuestionBox from "./AddressSameQuestionBox"
import TemporaryAddressBox from "./TemporaryAddressBox"
import PermanentAddressBox from "./PermanentAddressBox"
import AddressSubmissionButton from "./AddressSubmissionButton"
import { useProfile } from "../queries/useProfile";
import axios from "axios"
import { useNavigate } from "react-router-dom"

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

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function AddressQuestionsScreen() {
  const navigate = useNavigate()

  const { data: profileData } = useProfile();

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

  // State for permanent address form (shown when addressesSame === true)
  const [permanentAddressForm, setPermanentAddressForm] = useState({
    state: "",
    district: "",
    pinCode: "",
    city: "",
    center: "",
    street: "",
    landmark: "",
    doorNo: "",
  })

  const [permanentErrors, setPermanentErrors] = useState({
    state: "",
    district: "",
    pinCode: "",
    city: "",
    center: "",
    street: "",
    landmark: "",
    doorNo: "",
  })

  // State for temporary address dropdown and minimize
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)
  const [isFormMinimized, setIsFormMinimized] = useState(false)

  // State for permanent address dropdown and minimize
  const [isPermanentDropdownOpen, setIsPermanentDropdownOpen] = useState(false)
  const [permanentSearchQuery, setPermanentSearchQuery] = useState("")
  const permanentDropdownRef = useRef(null)
  const [isPermanentFormMinimized, setIsPermanentFormMinimized] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

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

  // Handler for permanent address form changes
  const handlePermanentFormChange = (field, value) => {
    setPermanentAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Validate on change
    const validator = validators[field]
    if (validator) {
      const err = validator(value)
      setPermanentErrors((prev) => ({ ...prev, [field]: err }))
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

  const validatePermanentAll = () => {
  const next = {}
  Object.keys(validators).forEach((key) => {
    next[key] = validators[key](permanentAddressForm[key])
  })
  setPermanentErrors(next)
  const isValid = Object.values(next).every((v) => v === "")
  return isValid
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

  // Validity attrs getter for permanent form
  const getPermanentValidityAttrs = (field) => {
    const val = permanentAddressForm[field]
    const err = permanentErrors[field]
    if (err && err.length) return { "aria-invalid": "true", "aria-valid": "false" }
    if (val && !err) return { "aria-invalid": "false", "aria-valid": "true" }
    return { "aria-invalid": "false", "aria-valid": "false" }
  }

  const handleStateSelect = (state) => {
    handleFormChange("state", state)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  // Handler for permanent address state select
  const handlePermanentStateSelect = (state) => {
    handlePermanentFormChange("state", state)
    setIsPermanentDropdownOpen(false)
    setPermanentSearchQuery("")
  }

  const filteredStates = INDIAN_STATES.filter((state) => state.toLowerCase()
    .includes(searchQuery.toLowerCase()))

    // Filtered states for permanent address
  const filteredPermanentStates = INDIAN_STATES.filter((state) =>
    state.toLowerCase().includes(permanentSearchQuery.toLowerCase()),)

  const handleSubmitAddresses = async () => {
    setSubmitError("")
    setSubmitSuccess(false)

    // Temporary address validation (when applicable)
  if (
    hasPermanentAddress === false ||
    (hasPermanentAddress === true && addressesSame === false)
  ) {
    const { isValid } = validateAll()
    if (!isValid) {
      setSubmitError("Please correct the highlighted temporary address fields.")
      return
    }
  }

  // Permanent address validation (when applicable)
  if (hasPermanentAddress === true && addressesSame !== null) {
    const isPermanentValid = validatePermanentAll()
    if (!isPermanentValid) {
      setSubmitError("Please correct the highlighted permanent address fields.")
      return
    }
  }

    const token = localStorage.getItem("GoldArtisanToken")
    if (!token) {
      setSubmitError("Missing authentication token. Please sign in again.")
      return
    }

    const phoneNumber = profileData?.phoneNumber || null;
    const payload = {
      phoneNumber,
      hasPermanentAddress,
      addressesSame: hasPermanentAddress === true ? addressesSame : null,
      temporaryAddress: null,
      permanentAddress: null,
    }

    if (hasPermanentAddress === false) {
      // Only temporary address exists
      payload.temporaryAddress = { ...addressForm }
    }

    if (hasPermanentAddress === true && addressesSame === true) {
      // Same address → only permanent
      payload.permanentAddress = { ...permanentAddressForm }
    }

    if (hasPermanentAddress === true && addressesSame === false) {
      // Both addresses exist
      payload.temporaryAddress = { ...addressForm }
      payload.permanentAddress = { ...permanentAddressForm }
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(`${apiBase}/GAAddressPath/saveAddressDetails`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response?.data?.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate("/HomeScreenPath")
        }, 600)
      } else {
        setSubmitError(response?.data?.message || "Failed to save address details")
      }
    } catch (err) {
      console.error("Address submission error:", err)
      const serverMsg = err?.response?.data?.message
      if (err?.response) {
        setSubmitError(serverMsg || `Server error: ${err.response.status}`)
      } else if (err?.request) {
        setSubmitError("No response from server. It may be sleeping or unreachable.")
      } else {
        setSubmitError(err.message || "An error occurred while saving address details.")
      }
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

  // Click outside handler for permanent address dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (permanentDropdownRef.current && !permanentDropdownRef.current.contains(event.target)) {
        setIsPermanentDropdownOpen(false)
        setPermanentSearchQuery("")
      }
    }

    if (isPermanentDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPermanentDropdownOpen])

  return (
    <div id="divId1_AddressQuestions">
      <div id="contentWrap_AddressQuestions">
        <TopQuestionBox
        hasPermanentAddress={hasPermanentAddress}
        onYes={handleYesClick}
        onNo={handleNoClick}
      />

      {hasPermanentAddress === true && (
        <AddressSameQuestionBox
          addressesSame={addressesSame}
          onYes={handleAddressesSameYes}
          onNo={handleAddressesSameNo}
        />
      )}

      {(
        hasPermanentAddress === false ||
        (hasPermanentAddress === true && addressesSame === false)
      ) && (
      <TemporaryAddressBox
        isFormMinimized={isFormMinimized}
        setIsFormMinimized={setIsFormMinimized}
        addressForm={addressForm}
        errors={errors}
        getValidityAttrs={getValidityAttrs}
        handleFormChange={handleFormChange}
        dropdownRef={dropdownRef}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredStates={filteredStates}
        handleStateSelect={handleStateSelect}
      />
      )}


      {hasPermanentAddress === true && addressesSame !== null && (
        <PermanentAddressBox
          isPermanentFormMinimized={isPermanentFormMinimized}
          setIsPermanentFormMinimized={setIsPermanentFormMinimized}
          permanentAddressForm={permanentAddressForm}
          permanentErrors={permanentErrors}
          getPermanentValidityAttrs={getPermanentValidityAttrs}
          handlePermanentFormChange={handlePermanentFormChange}
          permanentDropdownRef={permanentDropdownRef}
          isPermanentDropdownOpen={isPermanentDropdownOpen}
          setIsPermanentDropdownOpen={setIsPermanentDropdownOpen}
          permanentSearchQuery={permanentSearchQuery}
          setPermanentSearchQuery={setPermanentSearchQuery}
          filteredPermanentStates={filteredPermanentStates}
          handlePermanentStateSelect={handlePermanentStateSelect}
        />
      )}

      <AddressSubmissionButton
          isVisible={hasPermanentAddress !== null && (hasPermanentAddress === false || addressesSame !== null)}
          onSubmit={handleSubmitAddresses}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
      />

      </div>
    </div>
  )
}

export default AddressQuestionsScreen;