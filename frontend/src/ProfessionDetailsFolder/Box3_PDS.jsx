function Box3_PDS({ worksWithGold, setWorksWithGold })
{
  return (
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
  )
}

export default Box3_PDS;
