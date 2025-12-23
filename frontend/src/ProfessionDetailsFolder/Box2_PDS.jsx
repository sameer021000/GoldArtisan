function Box2_PDS({ worksWithSilver, setWorksWithSilver })
{
  return (
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
  )
}

export default Box2_PDS;