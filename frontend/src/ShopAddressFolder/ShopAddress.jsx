import "./ShopAddressCSS.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../queries/useAuth"

const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:7000"

function ShopAddress() {
  const { phoneNumber, isLoading: authLoading, isError: authError } = useAuth()

  const [addressData, setAddressData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAddress = async () => {
      if (authLoading) return

      if (authError || !phoneNumber) {
        setError("Authentication failed. Please sign in again.")
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("GoldArtisanToken")
      if (!token) {
        setError("Session expired. Please sign in again.")
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `${apiBase}/GAAddressGettingPath/getGAAddress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              phoneNumber,
            },
          }
        )

        if (response?.data?.success) {
          setAddressData(response.data.data)
        } else {
          setError(response?.data?.message || "Unable to fetch address details.")
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while fetching address details."
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddress()
  }, [authLoading, authError, phoneNumber])

  /* =========================
     UI STATES
  ========================= */
  if (isLoading) {
    return <div className="loadingText">Loading shop address...</div>
  }

  if (error) {
    return <div className="errorText">{error}</div>
  }

  return (
    <div id="divId1_ShopAddress">
      <div id="contentWrap_ShopAddress">
        <div id="topBox_ShopAddress">
          <h1 id="h1Id1_ShopAddress">Shop Address</h1>
          <p id="pId1_ShopAddress">
            Below are the raw address details provided earlier.
          </p>
        </div>

        {/* 🔍 RAW ADDRESS DATA (TEMPORARY) */}
        <div className="addressRawBox">
          <pre>{JSON.stringify(addressData, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default ShopAddress;