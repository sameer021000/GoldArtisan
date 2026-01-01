import "./ShopAddressCSS.css"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../queries/useAuth"
import { useNavigate } from "react-router-dom"

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
]

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function ShopAddress() {
  const navigate = useNavigate()
  const { phoneNumber, isLoading: authLoading, isError: authError } = useAuth()

  /* =========================
     FORM STATE
  ========================= */
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

  const [isStateLocked, setIsStateLocked] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /* =========================
     FETCH HOME ADDRESS (STATE LOCK ONLY)
  ========================= */
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
        const res = await axios.get(
          `${apiBase}/GAAddressGettingPath/getGAAddress`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (res?.data?.success && res.data.data) {
          const d = res.data.data

          // Present address ALWAYS wins
          const presentState = d.TemporaryAddress?.state
          const permanentState =
            d.HasPermanentAddress &&
            d.IsPermanentAndTemporaryAddressSame &&
            d.PermanentAddress?.state

          const lockedState = presentState || permanentState

          if (lockedState) {
            setAddressForm((prev) => ({ ...prev, state: lockedState }))
            setIsStateLocked(true)
          }
        }
      } catch (e) {
        console.error("Address fetch error:", e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddress()
  }, [authLoading, authError, phoneNumber])

  /* =========================
     VALIDATORS (UNCHANGED)
  ========================= */
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
    const err = validators[field]?.(value) || ""
    setErrors((prev) => ({ ...prev, [field]: err }))
  }

  const getValidityAttrs = (field) => {
    const val = addressForm[field]
    const err = errors[field]
    if (err) return { "aria-invalid": "true", "aria-valid": "false" }
    if (val) return { "aria-invalid": "false", "aria-valid": "true" }
    return {}
  }

  const filteredStates = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  )

  /* =========================
     SUBMIT (UNCHANGED LOGIC)
  ========================= */
  const handleSubmit = async () => {
    setSubmitError("")
    setSubmitSuccess(false)

    const nextErrors = {}
    Object.keys(validators).forEach(
      (k) => (nextErrors[k] = validators[k](addressForm[k]))
    )
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
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
      const res = await axios.post(
        `${apiBase}/GAShopAddressSavingPath/saveGAShopAddress`,
        { phoneNumber, shopAddress: addressForm },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res?.data?.success) {
        setSubmitSuccess(true)
        setTimeout(() => navigate("/HomeScreenPath"), 800)
      } else {
        setSubmitError("Failed to save address details")
      }
    } catch {
      setSubmitError("An error occurred while saving address details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="loadingText">Loading shop address...</div>

  /* =========================
     UI (UNCHANGED STRUCTURE)
  ========================= */
  return (
    <div id="divId1_AddressQuestions">
      <div id="contentWrap_AddressQuestions">
        <div id="topBox_AddressQuestions">
          <h1 id="h1Id1_AddressQuestions">Shop Address</h1>
          <p id="pId1_AddressQuestions">
            Please provide the address of your shop or workshop location.
          </p>
        </div>

        {/* 🔽 FORM CONTINUES EXACTLY AS YOUR CURRENT JSX */}
        {/* Only State field is locked conditionally */}
      </div>
    </div>
  )
}

export default ShopAddress
