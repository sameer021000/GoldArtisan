function Box4_PDS({ specialtyOptions, specialties, toggleSpecialty })
{
  return (
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
              specialties.includes(opt.id) ? "selectedSpecialty" : ""
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
  )
}

export default Box4_PDS;