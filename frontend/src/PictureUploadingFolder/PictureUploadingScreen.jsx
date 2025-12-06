// PictureUploadingScreen.jsx
import React, { useRef, useState, useEffect } from "react";
import "./PictureUploadingScreenCSS.css";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../queries/useProfile";
import axios from "axios"; // <-- added axios

// PROGRESS BAR import
import ProgressBar from "../ProgressBarFolder/ProgressBar";
import "../ProgressBarFolder/ProgressBar.css";

// API base (use env var in production)
const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

function PictureUploadingScreen()
{
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [filePicked, setFilePicked] = useState(false);
  const [showCameraButton, setShowCameraButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // PROGRESS state
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressValue, setProgressValue] = useState(null);

  // NEW: whether upload has completed successfully (used to change button to "Next")
  const [uploaded, setUploaded] = useState(false);

  // get profile via React Query (cached)
  const { data, isLoading } = useProfile();

  useEffect(() =>
  {
    // Detect mobile/tablet devices
    const isTouchDevice =
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.matchMedia("(pointer: coarse)").matches ||
      /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);

    setShowCameraButton(Boolean(isTouchDevice));
  }, []);

  // allowed extensions / mime types
  const allowedExts = ["png", "jpg", "jpeg"];
  const allowedMimes = ["image/png", "image/jpeg"];

  const isValidImage = (file) =>
  {
    if (!file) return false;
    const mimeOk = allowedMimes.includes(file.type);
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
    const extOk = allowedExts.includes(ext);
    return mimeOk || extOk;
  };

  const clearFileInput = () =>
  {
    // clear input
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName("");
    setFilePicked(false);
    // revoke only local object URLs (blob:)
    if (previewUrl && previewUrl.startsWith("blob:"))
    {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    // If user clears file after a successful upload, also reset uploaded flag
    setUploaded(false);
  };

  const handleTapUpload = () =>
  {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) =>
  {
    setErrorMsg("");
    const f = e.target.files && e.target.files[0];
    if (f) {
      if (!isValidImage(f))
      {
        setErrorMsg("Invalid file type — only PNG or JPG allowed.");
        clearFileInput();
        return;
      }
      setFileName(f.name);
      setFilePicked(true);

      // set preview
      if (previewUrl && previewUrl.startsWith("blob:"))
      {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);

      // picking a new file should clear any previous uploaded state
      setUploaded(false);
    }
    else
    {
      clearFileInput();
      setErrorMsg("");
    }
  };

  // cleanup on unmount - only revoke blob: urls
  useEffect(() =>
  {
    return () =>
    {
      if (previewUrl && previewUrl.startsWith("blob:"))
      {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCamera = () =>
  {
    if (fileInputRef.current)
    {
      // temporarily set capture to open camera
      fileInputRef.current.setAttribute("capture", "environment");
      // ensure accept still restricts to images
      fileInputRef.current.click();

      // remove capture after a short delay to avoid persistent capture attribute
      setTimeout(() =>
      {
        if (fileInputRef.current) fileInputRef.current.removeAttribute("capture");
      }, 800);
    }
  };

  // helper: start simulated progress (runs while uploading true AND progressValue === null)
  useEffect(() => {
    let timer = null;
    if (uploading && progressValue === null) {
      // start showing progress in indeterminate mode first (null)
      setProgressVisible(true);
      // after a short delay begin increasing simulated value towards ~90
      let current = 0;
      const start = Date.now();
      timer = setInterval(() => {
        // slowly increase; non-linear easing feel
        const elapsed = Date.now() - start;
        // formula to asymptote to 88-92% over time
        const target = 92;
        current = Math.min(target, Math.round((1 - Math.exp(-elapsed / 800)) * target));
        setProgressValue(current);
      }, 220);
    } else {
      // when uploading stops or when progressValue is set to a number, handle completion/hide
      if (!uploading && progressVisible) {
        // if we have a numeric value and it isn't 100, jump to 100 for UX
        if (typeof progressValue === "number" && progressValue < 100) {
          setProgressValue(100);
        }
        // hide after a short delay so the user sees 100%
        timer = setTimeout(() => {
          setProgressVisible(false);
          setProgressValue(null);
        }, 450);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploading, progressValue]);

  // robust upload using axios to get real-time progress
  const handleUploadId = async () =>
  {
    // if user hasn't selected a new local file, nothing to upload — just navigate forward
    if (!filePicked)
    {
      setErrorMsg("Please select or take a profile photo before continuing");
      return false;
    }

    if (!fileInputRef.current || !fileInputRef.current.files || !fileInputRef.current.files[0])
    {
      setErrorMsg("No file selected");
      return false;
    }

    const file = fileInputRef.current.files[0];

    setErrorMsg("");
    setUploading(true);

    // Show progress UI and start from 0 — axios will update progressValue
    setProgressVisible(true);
    setProgressValue(0);

    const controller = new AbortController();

    try
    {
      const formData = new FormData();
      formData.append("profilePhoto", file); // multer expects 'profilePhoto'

      const token = localStorage.getItem("GoldArtisanToken");
      if (!token)
      {
        setErrorMsg("Missing auth token. Please sign in again.");
        setUploading(false);
        // hide progress shortly
        setTimeout(() => {
          setProgressVisible(false);
          setProgressValue(null);
        }, 350);
        return false;
      }

      const endpoint = `${apiBase}/GAProfilePhotoUploadingPath/uploadGAProfilePhotoPath`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type here; browser/axios will set multipart boundary
        },
        onUploadProgress: (progressEvent) => {
          try {
            const { loaded, total } = progressEvent;
            if (total && total > 0) {
              const percent = Math.round((loaded * 100) / total);
              setProgressValue(percent);
            } else {
              // total unknown (chunked) — leave progressValue as null to use simulated behaviour
              // but only if it's currently null; otherwise keep current numeric value
              if (progressValue === null) {
                // keep indeterminate (simulated) — nothing to do here
              }
            }
          } catch (e) {
            // ignore progress parsing errors
            // do not interrupt upload
          }
        },
        signal: controller.signal,
        validateStatus: () => true, // we'll handle status manually
      });

      // determine content-type / response handling similar to fetch-based approach
      const resStatus = response.status;
      const resData = response.data;
      const resHeaders = response.headers || {};
      const contentTypeHeader = (resHeaders["content-type"] || resHeaders["Content-Type"] || "") + "";

      if (!contentTypeHeader.includes("application/json")) {
        // if server returned non-json, convert to string for error context
        const text = typeof resData === "string" ? resData : JSON.stringify(resData);
        throw new Error(`Server returned non-JSON response: ${resStatus} — ${text.slice(0, 200)}`);
      }

      if (resStatus < 200 || resStatus >= 300) {
        throw new Error(resData?.message || `Upload failed (${resStatus})`);
      }

      // success — show 100% briefly, set uploaded flag, but DO NOT auto-navigate
      setProgressValue(100);
      // small delay so user sees 100%
      setTimeout(() => {
        setUploading(false);
        setUploaded(true);
        // hide after short delay
        setTimeout(() => {
          setProgressVisible(false);
          setProgressValue(null);
        }, 420);
      }, 220);

      return true;
    }
    catch (err)
    {
      console.error("Upload error (axios):", err);
      // If axios returned a response with message, prefer that
      const serverMessage = err?.response?.data?.message || err?.message;
      setErrorMsg(serverMessage || "Upload error");

      // ensure progress UI hides after a short moment
      setUploading(false);
      setTimeout(() => {
        setProgressVisible(false);
        setProgressValue(null);
      }, 600);

      return false;
    }
    // no explicit finally block for hiding here because we handle on success/fail above
  };

  // NEW: central handler for upload/next button
  const handleButtonClick = async () => {
    // If already uploaded successfully, this acts as "Next"
    if (uploaded) {
      navigate("/AddressQuestionsPath");
      return;
    }

    // Otherwise perform the upload (same as previous behavior)
    await handleUploadId();
    // don't navigate here — handleUploadId sets uploaded = true on success
  };

  const fullName = data?.fullName || "Full Name";

  return (
    <div id="divId1_PictureUpload">
      <div id="contentWrap_PictureUpload">
        {/* Left: Upload box */}
        <div id="leftPane_Picture">
          <h1 id="h1Id1_Picture">Upload Your Profile Photo</h1>
          <p id="pId1_Picture">Upload a photo of yourself to showcase that as your profile</p>

          {/* Upload box */}
          <div
            id="uploadBox_Picture"
            role="button"
            onClick={handleTapUpload}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleTapUpload();
            }}
            aria-describedby="formatText_Picture fileInfo_Picture"
          >
            <div id="uploadIcon_Picture" aria-hidden="true">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 16l-4-4-4 4"></path>
                <path d="M12 12v9"></path>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26"></path>
                <path d="M7 20a4 4 0 01-1-7.87"></path>
              </svg>
            </div>

            <div id="tapText_Picture">Tap to upload photo</div>
            <div id="formatText_Picture">PNG or JPG only</div>

            {/* accept explicitly limited to PNG/JPG (extensions + MIME) */}
            <input
              id="fileInput_Picture"
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Only show OR + Camera button on mobile/tablet */}
          {showCameraButton && (
            <>
              <div id="orRow_Picture">
                <div id="sepLineLeft_Picture" />
                <div id="orText_Picture">OR</div>
                <div id="sepLineRight_Picture" />
              </div>

              <button id="openCameraBtn_Picture" type="button" onClick={handleOpenCamera}>
                Camera
              </button>
            </>
          )}

          {/* File chosen name / error */}
          <div id="fileInfo_Picture" aria-live="polite">
            {errorMsg ? <span style={{ color: "#ffb3b3" }}>{errorMsg}</span> : filePicked ? fileName : ""}
          </div>

          {/* Helper text shown when no file picked */}
          <div id="helperText_Picture" aria-live="polite">
            {!filePicked && !uploading ? "You must upload a photo to continue" : ""}
          </div>

          {/* PROGRESS BAR - inserted just above the button */}
          <div style={{ width: "100%", marginTop: 8 }}>
            <ProgressBar visible={progressVisible} progress={progressValue} label={uploading ? "Uploading profile photo" : ""} />
          </div>

          {/* Bottom Upload ID / Next button */}
          <div id="bottomRow_Picture">
            <button
              id="uploadIdBtn_Picture"
              type="button"
              onClick={handleButtonClick} // new handler
              disabled={uploading || (!filePicked && !uploaded)} // allow click if uploaded === true
              aria-disabled={uploading || (!filePicked && !uploaded)}
            >
              {uploading ? "Uploading..." : uploaded ? "Next" : !filePicked ? "Choose a photo" : "Upload"}
            </button>
          </div>
        </div>

        {/* Right: Preview box (circle image + full name) */}
        <div id="previewBox_Picture" aria-live="polite">
          <div id="previewInner_Picture">
            <div id="previewCircle_Picture" aria-hidden={!previewUrl}>
              {previewUrl ? (
                <img src={previewUrl} id="previewImg_Picture" />
              ) : (
                <div id="previewPlaceholder_Picture" aria-hidden="true">
                  {/* a simple icon / initials placeholder */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    <path d="M6 20c1.333-2 3.333-3 6-3s4.667 1 6 3" />
                  </svg>
                </div>
              )}
            </div>

            <div id="fullName_Picture">{isLoading ? '...' : fullName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PictureUploadingScreen;
