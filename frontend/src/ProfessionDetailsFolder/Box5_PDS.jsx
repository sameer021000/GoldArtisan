function Box5_PDS({customSpecialty,  setCustomSpecialty,  onAdd, error })
{
  return (
    <div id="questionBox4_ProfessionDetails">
      <h2 id="questionTitle4_ProfessionDetails">
        Please specify your work
      </h2>

      <div className="customSpecialtyInputRow">
        <button
          type="button"
          className="addSpecialtyBtn"
          onClick={onAdd}
          disabled={!customSpecialty.trim()}
          aria-label="Add specialty"
        >
          +
        </button>

        <input
          type="text"
          className="customInput"
          placeholder="Enter your work type"
          value={customSpecialty}
          onChange={(e) => setCustomSpecialty(e.target.value)}
        />
      </div>
      {error && (
        <div className="submit-message error">
          {error}
        </div>
      )}
    </div>
  )
}

export default Box5_PDS