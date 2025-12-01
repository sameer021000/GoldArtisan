import "./HomeScreenCSS.css"
import { useNavigate } from "react-router-dom"

function HomeScreen()
{
  const navigate = useNavigate()

  const handleCompleteProfile = () =>
  {
    console.log("[v0] Complete Profile button clicked")
    // Navigate to profile completion page when ready
    // navigate('/ProfilePath');
  }

  const handleSignOut = () =>
  {
    console.log("[v0] SignOut link clicked")
    localStorage.removeItem('GoldArtisanToken');
    navigate('/', { replace: true });
  }

  return (
    <div id="divId1_Home">
      <div id="contentWrap_Home">
        <h1 id="h1Id1_Home">Hii COMer</h1>

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
