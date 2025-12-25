import "./WorkExperienceCSS.css";
import { useProfessionDetails } from "../queries/useProfessionDetails";

function WorkExperienceScreen()
{
  const { data, isLoading, isError, error } = useProfessionDetails();

  if (isLoading) {
    return <div>Loading work experience details...</div>;
  }

  if (isError) {
    return (
      <div style={{ color: "red" }}>
        {error?.message || "Error fetching profession details"}
      </div>
    );
  }

  return (
    <div>
      <h3>Specify your experience in each field</h3>

      {/* Temporary debug output */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default WorkExperienceScreen;