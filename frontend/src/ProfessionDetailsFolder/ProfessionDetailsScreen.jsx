import { useState } from "react"
import "./ProfessionDetailsCSS.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../queries/useAuth"
import { useQueryClient } from "@tanstack/react-query";
import Box1_PDS from "./Box1_PDS"
import Box2_PDS from "./Box2_PDS"
import Box3_PDS from "./Box3_PDS"
import Box4_PDS from "./Box4_PDS"
import Box5_PDS from "./Box5_PDS"
import Button1_PDS from "./Button1_PDS"

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function ProfessionDetailsScreen()
{
  const navigate = useNavigate()

  const queryClient = useQueryClient();

  // 🔐 Auth/profile data
  const { phoneNumber, isLoading, isError } = useAuth()

  const [worksWithSilver, setWorksWithSilver] = useState(null)
  const [worksWithGold, setWorksWithGold] = useState(null)
  const [specialties, setSpecialties] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const baseSpecialtyOptions =
  [
    { id: "ornament-making", label: "Ornament Making" },
    { id: "polishing-finishing", label: "Polishing & Finishing" },
    { id: "design-cutting", label: "Design & Cutting" },
    { id: "other", label: "Other" },
  ]

  const [dynamicSpecialtyOptions, setDynamicSpecialtyOptions] =useState(baseSpecialtyOptions)

  const [customSpecialty, setCustomSpecialty] = useState("")
  const [customSpecialtyError, setCustomSpecialtyError] = useState("");

  const toggleSpecialty = (id) => {
    setSpecialties((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const validateCustomSpecialty = (value) =>
  {
    const trimmed = value.trimEnd()

    // 4️⃣ Ends with space
    if (value !== trimmed) {
      return "Work type should not end with a space"
    }

    // Empty after trim
    if (!trimmed) {
      return "Please enter your work type"
    }

    // 3️⃣ Only numbers
    if (/^\d+$/.test(trimmed)) {
      return "Work type cannot contain only numbers"
    }

    // 2️⃣ More than 4 words
    const words = trimmed.split(/\s+/)
    if (words.length > 4) {
      return "Please enter a maximum of 4 words"
    }

    // 5️⃣ Disallow 'and' (any case)
    if (words.some((w) => w.toLowerCase() === "and")) {
      return "The word 'and' is not allowed"
    }

    // 1️⃣ Special characters check
    // Allowed: letters, numbers, space, &, (, )
    if (!/^[a-zA-Z0-9\s&()-]+$/.test(trimmed)) {
      return "Special characters are not allowed (except &, (, ))"
    }

    return "" // ✅ valid
  }


  const handleAddCustomSpecialty = () =>
  {
    const error = validateCustomSpecialty(customSpecialty)
    setCustomSpecialtyError(error)
    if (error) return
    
    const value = customSpecialty.trim()
    const id = value.toLowerCase().replace(/\s+/g, "-")

    // Avoid duplicates
    if (dynamicSpecialtyOptions.some((o) => o.id === id)) {
      setCustomSpecialty("")
      setCustomSpecialtyError("")
      toggleSpecialty("other")
      return
    }

    const newOption = { id, label: value }

    setDynamicSpecialtyOptions((prev) => [
      ...prev.filter((o) => o.id !== "other"),
      newOption,
      { id: "other", label: "Other" },
    ])

    setSpecialties((prev) => [...prev.filter((v) => v !== "other"), id])
    setCustomSpecialty("")
    setCustomSpecialtyError("")
  }


  const handleSubmit = async () => {
    setSubmitError("")
    setSubmitSuccess(false)

    // ⛔ Validation
    if (worksWithSilver === null) {
      setSubmitError("Please tell us if you work with silver ornaments.")
      return
    }

    if (worksWithGold === null) {
      setSubmitError("Please tell us if you work with gold ornaments.")
      return
    }

    if (specialties.length === 0) {
      setSubmitError("Please select at least one type of work you do.")
      return
    }

    // ⛔ Auth state handling (important)
    if (isLoading) {
      setSubmitError("Profile data is still loading. Please try again.")
      return
    }

    if (isError || !phoneNumber) {
      setSubmitError("Authentication failed. Please sign in again.")
      return
    }

    const token = localStorage.getItem("GoldArtisanToken")
    if (!token) {
      setSubmitError("Session expired. Please sign in again.")
      return
    }

    const payload = {
      phoneNumber,
      worksWithSilver,
      worksWithGold,
      typesOfWorks : specialties,
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${apiBase}/GATypesOfWorksSavingPath/saveGATypesOfWorks`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.success) {
        queryClient.invalidateQueries({ queryKey: ["profession-details"] });
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate("/WorkExperienceDetailsPath")
        }, 600)
      } else {
        setSubmitError(
          response?.data?.message || "Unable to save profession details"
        )
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message
      setSubmitError(
        serverMsg || "Something went wrong while saving your details."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOtherSelected = specialties.includes("other")

  const canSubmit =
    worksWithSilver !== null &&
    worksWithGold !== null &&
    specialties.length > 0 &&
    !isSubmitting &&
    (!isOtherSelected || customSpecialty.trim().length > 0)

  return (
    <div id="divId1_ProfessionDetails">
      <div id="contentWrap_ProfessionDetails">
        <Box1_PDS />
        <Box2_PDS
          worksWithSilver={worksWithSilver}
          setWorksWithSilver={setWorksWithSilver}
        />
        <Box3_PDS
          worksWithGold={worksWithGold}
          setWorksWithGold={setWorksWithGold}
        />
        <Box4_PDS
          specialtyOptions={dynamicSpecialtyOptions}
          specialties={specialties}
          toggleSpecialty={toggleSpecialty}
        />
        {specialties.includes("other") && (
          <Box5_PDS
            customSpecialty={customSpecialty}
            setCustomSpecialty={setCustomSpecialty}
            onAdd={handleAddCustomSpecialty}
            error={customSpecialtyError}
          />
        )}
        <Button1_PDS
          worksWithSilver={worksWithSilver}
          worksWithGold={worksWithGold}
          specialties={specialties}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />
      </div>
    </div>
  )
}

export default ProfessionDetailsScreen
