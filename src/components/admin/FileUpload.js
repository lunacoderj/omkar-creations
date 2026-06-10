"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileCode, CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";

export default function FileUpload({ 
  value,           // current file URL
  fileName,        // current file name
  reelId,          // optional reel ID for organizing uploads
  onUploadComplete, // callback: ({ url, fileName, fileType, size }) => void
  onClear,          // callback when file is removed
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState("idle"); // idle, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedName, setUploadedName] = useState(fileName || "");
  const fileInputRef = useRef(null);

  const handleUpload = useCallback(async (file) => {
    if (!file) return;

    // Client-side validation
    const ext = file.name.split(".").pop().toLowerCase();
    const allowed = ["xml", "zip", "aep", "prproj", "json"];
    if (!allowed.includes(ext)) {
      setUploadState("error");
      setErrorMessage(`Invalid file type (.${ext}). Allowed: ${allowed.join(", ")}`);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadState("error");
      setErrorMessage("File too large. Maximum 50MB.");
      return;
    }

    setUploadState("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    // Simulate progress for UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (reelId) formData.append("reelId", reelId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setUploadProgress(100);
      setUploadState("success");
      setUploadedName(file.name);

      if (onUploadComplete) {
        onUploadComplete({
          url: data.url,
          fileName: data.fileName,
          fileType: data.fileType,
          size: data.size,
        });
      }
    } catch (err) {
      clearInterval(progressInterval);
      setUploadState("error");
      setErrorMessage(err.message || "Upload failed");
    }
  }, [reelId, onUploadComplete]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [handleUpload]);

  const handleRemove = useCallback(() => {
    setUploadState("idle");
    setUploadProgress(0);
    setUploadedName("");
    setErrorMessage("");
    if (onClear) onClear();
  }, [onClear]);

  const hasFile = value || uploadState === "success";

  return (
    <div className="admin-field">
      <label className="admin-label">Project File (XML / ZIP)</label>
      
      {/* Show uploaded file */}
      {hasFile && uploadState !== "uploading" ? (
        <div className="admin-upload__file-display">
          <div className="admin-upload__file-info">
            <div className="admin-upload__file-icon">
              <FileCode size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {uploadedName || fileName || "Project file"}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5 truncate">
                {value || "Uploaded successfully"}
              </p>
            </div>
            {uploadState === "success" && (
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            )}
          </div>
          <div className="admin-upload__file-actions">
            <button 
              type="button"
              className="admin-upload__replace-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="admin-upload__remove-btn"
              onClick={handleRemove}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`admin-upload__dropzone ${isDragging ? "admin-upload__dropzone--active" : ""} ${uploadState === "error" ? "admin-upload__dropzone--error" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => uploadState !== "uploading" && fileInputRef.current?.click()}
        >
          {uploadState === "uploading" ? (
            <div className="admin-upload__progress-wrap">
              <Loader2 size={24} className="text-amber-500 animate-spin" />
              <p className="text-xs text-white/60 mt-2">Uploading...</p>
              <div className="admin-upload__progress-bar">
                <div 
                  className="admin-upload__progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1">{Math.round(uploadProgress)}%</p>
            </div>
          ) : uploadState === "error" ? (
            <div className="admin-upload__error-wrap">
              <AlertCircle size={24} className="text-rose-400" />
              <p className="text-xs text-rose-400 mt-2">{errorMessage}</p>
              <button
                type="button"
                className="text-[10px] text-white/40 mt-1 hover:text-white transition-colors underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadState("idle");
                  setErrorMessage("");
                }}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="admin-upload__icon">
                <Upload size={20} className="text-white/30" />
              </div>
              <p className="text-xs text-white/50 mt-2">
                <span className="text-amber-500 font-medium">Click to upload</span> or drag & drop
              </p>
              <p className="text-[10px] text-white/25 mt-1">
                XML, ZIP, JSON • Max 50MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,.zip,.aep,.prproj,.json"
        onChange={handleFileSelect}
        className="hidden"
        style={{ display: "none" }}
      />
    </div>
  );
}
