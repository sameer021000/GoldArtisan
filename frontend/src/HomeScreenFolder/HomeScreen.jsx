import "./HomeScreenCSS.css"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomeScreen()
{
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // '' | error message
  const [fullName, setFullName] = useState("COMer");

  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000";

  useEffect(() =>
  {
    // Get the token from localStorage
    const token = localStorage.getItem('GoldArtisanToken');
    console.log("GoldArtisan's Token is : ", token);
    if (!token)
    {
      setError("You are not authorized. Please sign in.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const fetchProfile = async () =>
    {
      try
      {
        setLoading(true);
        setError("");

        const res = await axios.get(`${apiBase}/Operations/getGAFullName`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });

        if (res?.data?.success && res.data.data)
        {
          const { firstName, lastName } = res.data.data;
          const name = `${firstName || ""} ${lastName || ""}`.trim();
          setFullName(name || "COMer");
        }
        else
        {
          // Unexpected shape or token invalidated server-side
          setError("Unable to fetch profile. Please sign in again.");
          localStorage.removeItem("GoldArtisanToken");
        }
      }
      catch (err)
      {
        if (axios.isCancel(err))
        {
          // request was aborted
          console.log("Profile request cancelled");
        }
        else if (err?.response)
        {
          // server responded with error code
          if (err.response.status === 401)
          {
            setError("Session expired. Please sign in again.");
            localStorage.removeItem("GoldArtisanToken");
            navigate('/SignInPath', { replace: true });
          }
          else
          {
            setError(err.response.data?.message || "Server error while fetching profile.");
          }
        }
        else if (err?.request)
        {
          setError("No response from server. It may be unreachable.");
        }
        else
        {
          setError(err.message || "An unexpected error occurred.");
        }
      }
      finally
      {
        setLoading(false);
      }
    };
    fetchProfile();

    // cleanup: abort fetch if component unmounts
    return () => controller.abort();
  }, []);

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

export default HomeScreen
