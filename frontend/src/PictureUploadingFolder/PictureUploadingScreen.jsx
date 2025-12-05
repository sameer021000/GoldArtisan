// PictureUploadingScreen.jsx
import React, { useRef, useState, useEffect } from "react";
import "./PictureUploadingScreenCSS.css";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../queries/useProfile"; // <-- path to your hook

// API base (use env var in production)
const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

function PictureUploadingScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [filePicked, setFilePicked] = useState(false);
  const [showCameraButton, setShowCameraButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // get profile via React Query (cached)
  const { data, isLoading } = useProfile();

  useEffect(() => {
    // Detect mobile/tablet devices
    const isTouchDevice =
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.matchMedia("(pointer: coarse)").matches ||
      /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);

    setShowCameraButton(Boolean(isTouchDevice));
  }, []);

  // if profile has a photoUrl from server, show it as initial preview until user picks a local file
  useEffect(() => {
    // only set if there is no local preview (local previews are blob: urls)
    if (data && data.photoUrl && !previewUrl) {
      setPreviewUrl(data.photoUrl);
      setFilePicked(false);
      setFileName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // allowed extensions / mime types
  const allowedExts = ["png", "jpg", "jpeg"];
  const allowedMimes = ["image/png", "image/jpeg"];

  const isValidImage = (file) => {
    if (!file) return false;
    const mimeOk = allowedMimes.includes(file.type);
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
    const extOk = allowedExts.includes(ext);
    return mimeOk || extOk;
  };

  const clearFileInput = () => {
    // clear input
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileName("");
    setFilePicked(false);
    // revoke only local object URLs (blob:)
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  };

  const handleTapUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const f = e.target.files && e.target.files[0];
    if (f) {
      if (!isValidImage(f)) {
        setErrorMsg("Invalid file type — only PNG or JPG allowed.");
        clearFileInput();
        return;
      }
      setFileName(f.name);
      setFilePicked(true);

      // set preview
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      clearFileInput();
      setErrorMsg("");
    }
  };

  // cleanup on unmount - only revoke blob: urls
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      // temporarily set capture to open camera
      fileInputRef.current.setAttribute("capture", "environment");
      // ensure accept still restricts to images
      fileInputRef.current.click();

      // remove capture after a short delay to avoid persistent capture attribute
      setTimeout(() => {
        if (fileInputRef.current) fileInputRef.current.removeAttribute("capture");
      }, 800);
    }
  };

  // robust fetch + response handling
  const handleUploadId = async () => {
    // if user hasn't selected a new local file, nothing to upload — just navigate forward
    if (!filePicked) {
      navigate("/WorkDetailsEnteringPath");
      return;
    }

    if (!fileInputRef.current || !fileInputRef.current.files || !fileInputRef.current.files[0]) {
      setErrorMsg("No file selected.");
      return;
    }

    const file = fileInputRef.current.files[0];

    setErrorMsg("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file); // multer expects 'profilePhoto'

      const token = localStorage.getItem("GoldArtisanToken");
      if (!token) {
        setErrorMsg("Missing auth token. Please sign in again.");
        setUploading(false);
        return;
      }

      // IMPORTANT: use full backend URL so the request actually reaches your backend (not the React dev server)
      const endpoint = `${apiBase}/GAProfilePhotoUploadingPath/uploadGAProfilePhotoPath`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
          // do NOT set Content-Type here; browser will set the multipart boundary
        }
      });

      // check content-type before parsing JSON (some servers return HTML on error)
      const contentType = res.headers.get("content-type") || "";
      let payload;
      if (contentType.includes("application/json")) {
        payload = await res.json();
      } else {
        // if not JSON, read as text for debugging
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${res.status} ${res.statusText} — ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(payload?.message || `Upload failed (${res.status})`);
      }

      // success
      navigate("/WorkDetailsEnteringPath");
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
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

          {/* Bottom Upload ID button */}
          <div id="bottomRow_Picture">
            <button
              id="uploadIdBtn_Picture"
              type="button"
              onClick={handleUploadId}
              disabled={uploading}
              aria-disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
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
