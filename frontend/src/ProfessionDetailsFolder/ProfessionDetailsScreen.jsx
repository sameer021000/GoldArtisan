import { useState } from "react"
import "./ProfessionDetailsCSS.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../queries/useAuth"
import Box1_PDS from "./Box1_PDS"
import Box2_PDS from "./Box2_PDS"
import Box3_PDS from "./Box3_PDS"
import Box4_PDS from "./Box4_PDS"
import Button1_PDS from "./Button1_PDS"

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function ProfessionDetailsScreen() {
  const navigate = useNavigate()

  // 🔐 Auth/profile data
  const { phoneNumber, isLoading, isError } = useAuth()

  const [worksWithSilver, setWorksWithSilver] = useState(null)
  const [worksWithGold, setWorksWithGold] = useState(null)
  const [specialties, setSpecialties] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const specialtyOptions = [
    { id: "ornament-making", label: "Ornament Making" },
    { id: "polishing-finishing", label: "Polishing & Finishing" },
    { id: "design-cutting", label: "Design & Cutting" },
  ]

  const toggleSpecialty = (id) => {
    setSpecialties((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
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
      specialties,
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${apiBase}/GAProfessionDetailsPath/saveProfessionDetails`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate("/HomeScreenPath")
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

  const canSubmit =
    worksWithSilver !== null &&
    worksWithGold !== null &&
    specialties.length > 0 &&
    !isSubmitting

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
          specialtyOptions={specialtyOptions}
          specialties={specialties}
          toggleSpecialty={toggleSpecialty}
        />
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
