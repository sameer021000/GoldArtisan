import "./HomeScreenCSS.css"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../queries/useProfile"; // <-- React Query hook (keep path if same)

function HomeScreen()
{
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // '' | error message
  const [fullName, setFullName] = useState("COMer");

  // useProfile returns the cached/fetched profile
  const { data, isLoading, isError, error: rqError } = useProfile({
    // note: default options are coming from QueryClient setup in App.js
  });

  // keep the original loading/error/fullName states for minimal changes to UI/structure
  useEffect(() => {
    setLoading(Boolean(isLoading));
  }, [isLoading]);

  useEffect(() => {
    if (data && data.fullName) {
      setFullName(data.fullName || "COMer");
      setError("");
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      // Map React Query error to the same messages/flow you expected
      // rqError can be an axios error or a thrown object from useProfile's fetch
      const respStatus = rqError?.response?.status || rqError?.status;
      const serverMsg = rqError?.response?.data?.message || rqError?.message;

      if (respStatus === 401) {
        setError("Session expired. Please sign in again.");
        localStorage.removeItem("GoldArtisanToken");
        // preserve previous behavior: navigate to sign-in
        navigate('/SignInPath', { replace: true });
      } else if (!localStorage.getItem('GoldArtisanToken')) {
        setError("You are not authorized. Please sign in.");
      } else {
        setError(serverMsg || "Server error while fetching profile.");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, rqError]);

  const handleCompleteProfile = () =>
  {
    console.log("[v0] Complete Profile button clicked")
    navigate('/PictureUploadingPath');
  }

  const handleSignOut = () =>
  {
    console.log("[v0] SignOut link clicked")
    localStorage.removeItem('GoldArtisanToken');
    navigate('/SignUpPath', { replace: true });
  }

  if (error)
  {
    return (
      <div id="divId1_Home">
        <div id="contentWrap_Home">
          <h1 id="h1Id1_Home">Hii</h1>
          <div style={{ color: "#ffb3b3", padding: "12px 0" }}>{error}</div>
          <button id="btnId1_Home" type="button" onClick={() => navigate("/SignInPath")}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="divId1_Home">
      <div id="contentWrap_Home">
        <h1 id="h1Id1_Home">Hii {loading ? "..." : fullName}</h1>

        <h2 id="h2Id1_Home">Welcome to Gold Artisan Module</h2>

        <p id="pId1_Home">
          If you are an Ornament maker/Ornament Polisher/Ornament Design Cutter, then 
          complete your profile by providing your details
        </p>

        <p id="pId2_Home">Click on below button when you ready</p>

        <button id="btnId1_Home" type="button" onClick={handleCompleteProfile}>
          Complete your profile
        </button>

        <p id="pId3_Home">
          Want to complete later?{" "}
          <span id="signOutLink_Home" onClick={handleSignOut}>
            SignOut
          </span>
        </p>
      </div>
    </div>
  )
}

export default HomeScreen;
