"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhoto?: string;
  className?: string;
}

export function PhotoUpload({ onPhotoUploaded, currentPhoto, className = "" }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large (max 10MB)");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/profile/upload-photo", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setPreview(result.photoUrl);
      onPhotoUploaded(result.photoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentPhoto || null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removePhoto = () => {
    setPreview(null);
    setError(null);
    onPhotoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto();
                }}
                className="opacity-0 hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <Upload size={24} />
            <span className="text-xs mt-1">Upload</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {!error && preview && (
        <div className="flex items-center gap-2 mt-2 text-green-500 text-sm">
          <CheckCircle size={16} />
          <span>Photo uploaded successfully</span>
        </div>
      )}
    </div>
  );
}