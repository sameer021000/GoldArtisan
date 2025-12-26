import "./WorkExperienceCSS.css";
import { useProfessionDetails } from "../queries/useProfessionDetails";
import { useState } from "react";

function WorkExperienceScreen() {
  const { data, isLoading, isError, error } = useProfessionDetails();

  // Experience stored in months (0–240)
  const [experience, setExperience] = useState({});

  const QUICK_OPTIONS = [
    { label: "0 yrs", value: 0 },
    { label: "6 mos", value: 6 },
    { label: "1 yr", value: 12 },
    { label: "3 yrs", value: 36 },
    { label: "5 yrs", value: 60 },
    { label: "10 yrs", value: 120 },
    { label: "15 yrs", value: 180 },
    { label: "20 yrs", value: 240 },
  ];

  if (isLoading) {
    return <div className="loadingText">Loading work experience details...</div>;
  }

  if (isError) {
    return (
      <div className="errorText">
        {error?.message || "Error fetching profession details"}
      </div>
    );
  }

  const {
    TypesOfWorks = [],
    WorksWithGold = false,
    WorksWithSilver = false,
  } = data || {};

  const handleChange = (key, value) => {
    setExperience((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const renderQuestion = (metal, workId) => {
    const label = workId.replace(/-/g, " ");
    const key = `${metal}-${workId}`;
    const months = experience[key] ?? 0;

    return (
      <div className="experienceCard" key={key}>
        <h4 className="experienceQuestion">
          How long have you been working with {metal} {label}?
        </h4>

        {/* Quick Select Pills */}
        <div className="pillRow">
          {QUICK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`pillBtn ${months === opt.value ? "active" : ""}`}
              onClick={() => handleChange(key, opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Fine Tune Slider */}
        <div className="sliderRow">
          <input
            type="range"
            min={0}
            max={240}      // 20 years
            step={1}       // 1 month interval
            value={months}
            onChange={(e) => handleChange(key, e.target.value)}
          />
          <span className="experienceValue">
            {Math.floor(months / 12)} yrs {months % 12} mos
          </span>
        </div>
      </div>
    );
  };

  return (
    <div id="divId1_WorkExperience">
      <div id="contentWrap_WorkExperience">
        <div id="topBox_WorkExperience">
          <h1 id="h1Id1_WorkExperience">Work Experience</h1>
          <p id="pId1_WorkExperience">
            Tell us how long you have been working in each area.
          </p>
        </div>

        {WorksWithGold &&
          TypesOfWorks.map((work) => renderQuestion("Gold", work))}

        {WorksWithSilver &&
          TypesOfWorks.map((work) => renderQuestion("Silver", work))}
      </div>
    </div>
  );
}

export default WorkExperienceScreen;
