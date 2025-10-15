/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import StepHeader from "../components/StepHeader";
export default function PhotoStep({
  draft,
  addPhoto,
  removePhoto,
  photosValid,
}: any) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };
  const handleRemove = (fileName: string, url: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
    removePhoto(url);
  };
  const handleUpload = async () => {
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        if (data.secure_url) {
          addPhoto(data.secure_url); // ✅ Cloudinary URL saved to Zustand
        }
      }
      // setFiles([]); // clear after upload
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: true,
  });
  return (
    <>
      <StepHeader
        title="Photos"
        desc="Upload high-quality images by dragging and dropping or clicking below."
      />
      {/* Drag & Drop area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#00b894] transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop your photos here, or{" "}
          <span className="text-[#00b894] font-medium">click to select</span>
        </p>
      </div>
      {/* Preview thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {files.map((file) => {
          const previewUrl = URL.createObjectURL(file);
          return (
            <div
              key={file.name}
              className="relative rounded-lg overflow-hidden shadow"
            >
              <img
                src={previewUrl}
                alt={file.name}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                onClick={() => handleRemove(file.name, previewUrl)}
              >
                <FaTrash size={12} />
              </button>
            </div>
          );
        })}
      </div>
      {/* Validation message */}
      {!photosValid && (
        <p className="text-xs text-rose-600 mt-3">
          Please add at least 3 photos.
        </p>
      )}
      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 bg-[#00b894] text-white px-6 py-2 rounded-lg shadow hover:bg-[#019a7a] transition"
        >
          {uploading ? "Uploading..." : "Upload your image"}
        </button>
      )}
    </>
  );
}
