"use client"

import "./ShopAddressCSS.css"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../queries/useAuth"
import { useNavigate } from "react-router-dom"
import TopBox_SA from "./TopBox_SA"
import ShopAddressBox_SA from "./ShopAddressBox_SA"
import ShopAddressSavingButton_SA from "./ShopAddressSavingButton_SA"

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

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addressData, setAddressData] = useState(null)
  const [lockedState, setLockedState] = useState(null)

  // Validation logic
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
          const data = response.data.data
          setAddressData(data)
          let stateToLock = null

          if (data.TemporaryAddress?.state) {
            stateToLock = data.TemporaryAddress.state
          } else if (data.PermanentAddress?.state) {
            stateToLock = data.PermanentAddress.state
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

  const handleSubmit = async () => {
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

  if (isLoading) return <div className="loadingText">Loading shop address...</div>

  return (
    <div id="divId1_ShopAddress">
      <div id="contentWrap_ShopAddress">
        <TopBox_SA />

        <ShopAddressBox_SA
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          errors={errors}
          setErrors={setErrors}
          lockedState={lockedState}
        />

        <ShopAddressSavingButton_SA
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default ShopAddress
