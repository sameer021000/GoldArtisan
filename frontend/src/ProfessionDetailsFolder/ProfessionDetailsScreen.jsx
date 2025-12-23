import { useState } from "react"
import "./ProfessionDetailsCSS.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../queries/useAuth"

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
        {/* Top */}
        <div id="topBox_ProfessionDetails">
          <h1 id="h1Id1_ProfessionDetails">
            What kind of ornament work do you specialize in?
          </h1>
          <p id="pId1_ProfessionDetails">
            This helps us understand your skills better
          </p>
        </div>

        {/* Silver */}
        <div id="questionBox1_ProfessionDetails">
          <h2 id="questionTitle1_ProfessionDetails">
            Do you work with silver ornaments?
          </h2>
          <div id="buttonGroup1_ProfessionDetails">
            <button
              type="button"
              className={worksWithSilver === true ? "selectedOption" : ""}
              onClick={() => setWorksWithSilver(true)}
            >
              ✓ Yes
            </button>
            <button
              type="button"
              className={worksWithSilver === false ? "selectedOption" : ""}
              onClick={() => setWorksWithSilver(false)}
            >
              ✕ No
            </button>
          </div>
        </div>

        {/* Gold */}
        <div id="questionBox2_ProfessionDetails">
          <h2 id="questionTitle2_ProfessionDetails">
            Do you work with gold ornaments?
          </h2>
          <div id="buttonGroup2_ProfessionDetails">
            <button
              type="button"
              className={worksWithGold === true ? "selectedOption" : ""}
              onClick={() => setWorksWithGold(true)}
            >
              ✓ Yes
            </button>
            <button
              type="button"
              className={worksWithGold === false ? "selectedOption" : ""}
              onClick={() => setWorksWithGold(false)}
            >
              ✕ No
            </button>
          </div>
        </div>

        {/* Specialties */}
        <div id="questionBox3_ProfessionDetails">
          <h2 id="questionTitle3_ProfessionDetails">
            Which type of work do you do?
          </h2>
          <p id="subtitle3_ProfessionDetails">
            You can select more than one option
          </p>

          <div id="specialtyGroup_ProfessionDetails">
            {specialtyOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={
                  specialties.includes(opt.id)
                    ? "selectedSpecialty"
                    : ""
                }
                onClick={() => toggleSpecialty(opt.id)}
              >
                <div className="checkIcon_ProfessionDetails">
                  {specialties.includes(opt.id) ? "✓" : ""}
                </div>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        {(worksWithSilver !== null ||
          worksWithGold !== null ||
          specialties.length > 0) && (
          <div id="submitButtonContainer_ProfessionDetails">
            <button
              id="submitBtn_ProfessionDetails"
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>

            {submitError && (
              <div className="submit-message error">{submitError}</div>
            )}
            {submitSuccess && (
              <div className="submit-message success">
                Profession details saved successfully
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfessionDetailsScreen
