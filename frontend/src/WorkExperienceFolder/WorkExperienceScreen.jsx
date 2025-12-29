import "./WorkExperienceCSS.css"
import { useProfessionDetails } from "../queries/useProfessionDetails"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../queries/useAuth"
import { useQueryClient } from "@tanstack/react-query";

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function WorkExperienceScreen() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { phoneNumber, isLoading: authLoading, isError: authError } = useAuth()
  const { data, isLoading, isError, error } = useProfessionDetails()

  const [experience, setExperience] = useState({})
  const [collapsedRoles, setCollapsedRoles] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const QUICK_OPTIONS = [
    { label: "0 yrs", value: 0 },
    { label: "6 mon", value: 6 },
    { label: "1 yr", value: 12 },
    { label: "3 yrs", value: 36 },
    { label: "5 yrs", value: 60 },
    { label: "10 yrs", value: 120 },
    { label: "15 yrs", value: 180 },
    { label: "20 yrs", value: 240 },
  ]

  const workTypeLabels = {
    "ornament-making": "Ornament Making",
    "polishing-finishing": "Polishing & Finishing",
    "design-cutting": "Design & Cutting",
  }

  if (isLoading) {
    return <div className="loadingText">Loading work experience details...</div>
  }

  if (isError) {
    return (
      <div className="errorText">
        {error?.message || "Error fetching profession details"}
      </div>
    )
  }

  const {
    TypesOfWorks = [],
    WorksWithGold = false,
    WorksWithSilver = false,
  } = data || {}

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (workId, metal, value) => {
    setExperience((prev) => ({
      ...prev,
      [workId]: {
        ...(prev[workId] || {}),
        [metal]: Number(value),
      },
    }))
  }

  const toggleRole = (workId) => {
    setCollapsedRoles((prev) => ({
      ...prev,
      [workId]: !prev[workId],
    }))
  }

  /* =========================
     FRONTEND VALIDATION
  ========================= */
  const validateExperience = () => {
    let hasAnyNonZeroExperience = false

    for (const workType of TypesOfWorks) {
      const entry = experience[workType] || {}
      const gold = entry.gold ?? 0
      const silver = entry.silver ?? 0

      if (gold < 0 || gold > 240 || silver < 0 || silver > 240) {
        return "Experience must be between 0 and 20 years."
      }

      if (gold > 0 || silver > 0) {
        hasAnyNonZeroExperience = true
      }
    }

    if (!hasAnyNonZeroExperience) {
      return "Please enter experience for at least one work type."
    }

    return ""
  }

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setSubmitError("")
    setSubmitSuccess(false)

    const validationError = validateExperience()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    if (authLoading) {
      setSubmitError("Profile data is still loading. Please try again.")
      return
    }

    if (authError || !phoneNumber) {
      setSubmitError("Authentication failed. Please sign in again.")
      return
    }

    const token = localStorage.getItem("GoldArtisanToken")
    if (!token) {
      setSubmitError("Session expired. Please sign in again.")
      return
    }

    // 🔁 Transform frontend state → backend format
    const experiencesPayload = TypesOfWorks.map((workType) => ({
      WorkType: workType,
      GoldMonths: experience[workType]?.gold ?? 0,
      SilverMonths: experience[workType]?.silver ?? 0,
    }))

    const payload = {
      phoneNumber,
      worksWithGold: WorksWithGold,
      worksWithSilver: WorksWithSilver,
      typesOfWorks: TypesOfWorks,
      experiences: experiencesPayload,
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post(
        `${apiBase}/GAWorkExperienceSavingPath/saveGAWorkExperience`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response?.data?.success) {
        queryClient.invalidateQueries({ queryKey: ["work-experience"] })
        setSubmitSuccess(true)
        setTimeout(() => {
          navigate("/NextScreenPath") // update when next screen is ready
        }, 600)
      } else {
        setSubmitError(
          response?.data?.message || "Unable to save work experience"
        )
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message
      setSubmitError(
        serverMsg || "Something went wrong while saving work experience."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =========================
     UI
  ========================= */
  const renderWorkTypeCard = (workId) => {
    const label = workTypeLabels[workId] || workId.replace(/-/g, " ")
    const isCollapsed = collapsedRoles[workId]

    return (
      <div className="experienceCard" key={workId}>
        <div
          className="workTypeTitle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => toggleRole(workId)}
        >
          <span>{label}</span>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "22px",
              fontWeight: "700",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            {isCollapsed ? "+" : "−"}
          </button>
        </div>

        {!isCollapsed && (
          <div className="metalColumns">
            {WorksWithGold && (
              <div className="metalSection">
                <div className="metalBadge goldBadge">Gold</div>
                <div className="pillRow">
                  {QUICK_OPTIONS.map((opt) => {
                    const currentValue = experience[workId]?.gold ?? 0
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`pillBtn ${
                          currentValue === opt.value ? "active" : ""
                        }`}
                        onClick={() =>
                          handleChange(workId, "gold", opt.value)
                        }
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                <div className="sliderRow">
                  <input
                    type="range"
                    min={0}
                    max={240}
                    step={1}
                    value={experience[workId]?.gold ?? 0}
                    onChange={(e) =>
                      handleChange(workId, "gold", e.target.value)
                    }
                  />
                  <span className="experienceValue">
                    {Math.floor(
                      (experience[workId]?.gold ?? 0) / 12
                    )} yrs {(experience[workId]?.gold ?? 0) % 12} mon
                  </span>
                </div>
              </div>
            )}

            {WorksWithSilver && (
              <div className="metalSection">
                <div className="metalBadge silverBadge">Silver</div>
                <div className="pillRow">
                  {QUICK_OPTIONS.map((opt) => {
                    const currentValue = experience[workId]?.silver ?? 0
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`pillBtn ${
                          currentValue === opt.value ? "active" : ""
                        }`}
                        onClick={() =>
                          handleChange(workId, "silver", opt.value)
                        }
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>

                <div className="sliderRow">
                  <input
                    type="range"
                    min={0}
                    max={240}
                    step={1}
                    value={experience[workId]?.silver ?? 0}
                    onChange={(e) =>
                      handleChange(workId, "silver", e.target.value)
                    }
                  />
                  <span className="experienceValue">
                    {Math.floor(
                      (experience[workId]?.silver ?? 0) / 12
                    )} yrs {(experience[workId]?.silver ?? 0) % 12} mon
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div id="divId1_WorkExperience">
      <div id="contentWrap_WorkExperience">
        <div id="topBox_WorkExperience">
          <h1 id="h1Id1_WorkExperience">Work Experience</h1>
          <p id="pId1_WorkExperience">
            Tell us how long you have been working in each area.
          </p>
        </div>

        {TypesOfWorks.map((work) => renderWorkTypeCard(work))}

        <div id="submitButtonContainer_WorkExperience">
          <button
            type="button"
            id="submitBtn_WorkExperience"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Saving..." : "Submit Details"}
          </button>

          {submitError && (
            <div className="submit-message error">{submitError}</div>
          )}

          {submitSuccess && (
            <div className="submit-message success">
              Work experience saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkExperienceScreen
