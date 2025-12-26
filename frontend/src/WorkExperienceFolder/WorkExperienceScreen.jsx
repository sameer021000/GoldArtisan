"use client"

import "./WorkExperienceCSS.css"
import { useProfessionDetails } from "../queries/useProfessionDetails"
import { useState } from "react"

function WorkExperienceScreen() {
  const { data, isLoading, isError, error } = useProfessionDetails()

  const [experience, setExperience] = useState({})
  const [collapsedRoles, setCollapsedRoles] = useState({})

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

  const renderWorkTypeCard = (workId) => {
    const label = workTypeLabels[workId] || workId.replace(/-/g, " ")
    const isCollapsed = collapsedRoles[workId]

    return (
      <div className="experienceCard" key={workId}>
        {/* Header */}
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
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "22px",
              fontWeight: "700",
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: "1",
            }}
          >
            {isCollapsed ? "+" : "−"}
          </button>
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <div className="metalColumns">
            {/* Gold */}
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
                    )}{" "}
                    yrs {(experience[workId]?.gold ?? 0) % 12} mon
                  </span>
                </div>
              </div>
            )}

            {/* Silver */}
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
                    )}{" "}
                    yrs {(experience[workId]?.silver ?? 0) % 12} mon
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
            Tell us how long you have been working in each area. Select quick
            options or fine-tune with the slider.
          </p>
        </div>

        {TypesOfWorks.map((work) => renderWorkTypeCard(work))}
      </div>
    </div>
  )
}

export default WorkExperienceScreen
