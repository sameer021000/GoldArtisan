// PictureUploadingScreen.jsx
import React, { useRef, useState, useEffect } from "react";
import "./PictureUploadingScreenCSS.css";
import { useNavigate } from "react-router-dom";

function PictureUploadingScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [filePicked, setFilePicked] = useState(false);
  const [showCameraButton, setShowCameraButton] = useState(false);

  useEffect(() => {
    // Detect mobile/tablet devices
    const isTouchDevice =
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      window.matchMedia("(pointer: coarse)").matches ||
      /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);

    setShowCameraButton(Boolean(isTouchDevice));
  }, []);

  const handleTapUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFileName(f.name);
      setFilePicked(true);
    } else {
      setFileName("");
      setFilePicked(false);
    }
  };

  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();

      setTimeout(() => {
        if (fileInputRef.current) fileInputRef.current.removeAttribute("capture");
      }, 800);
    }
  };

  const handleUploadId = () => {
    console.log("Uploading file:", fileName);
    navigate("/WorkDetailsEnteringPath");
  };

  return (
    <div id="divId1_PictureUpload">
      <div id="contentWrap_PictureUpload">
        
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

          <input
            id="fileInput_Picture"
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
              Open Camera
            </button>
          </>
        )}

        {/* File chosen name */}
        <div id="fileInfo_Picture" aria-live="polite">
          {filePicked ? fileName : ""}
        </div>

        {/* Bottom Upload ID button */}
        <div id="bottomRow_Picture">
          <button
            id="uploadIdBtn_Picture"
            type="button"
            onClick={handleUploadId}
            disabled={!filePicked}
            aria-disabled={!filePicked}
          >
            Upload ID
          </button>
        </div>
      </div>
    </div>
  );
}

export default PictureUploadingScreen;
