"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Play, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import videoApiRequest from "@/apiRequests/video";
import axios from "axios";

interface VideoUploadProps {
  lessonId?: number; // Optional for new lessons
  onUploadSuccess?: (videoKey: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  currentVideoUrl?: string; // For existing videos
}

export function VideoUpload({
  lessonId,
  onUploadSuccess,
  onUploadError,
  className,
  disabled = false,
  currentVideoUrl,
}: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoKey, setVideoKey] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 500 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "File too large",
        description: "Video file must be less than 100MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setIsSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!lessonId) {
      toast({
        title: "Lesson not saved",
        description: "Please save the lesson first before uploading video",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get presigned URL
      const response = await videoApiRequest.getVideoUploadUrl({
        lessonId: lessonId,
        filename: file.name,
        contentType: file.type,
      });

      const { uploadUrl, key } = response.payload.result;

      // Upload to S3 using presigned URL
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      setVideoKey(key);
      setIsSuccess(true);
      setUploadProgress(100);

      toast({
        title: "Upload successful",
        description: "Video has been uploaded successfully!",
      });

      onUploadSuccess?.(key);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = "Failed to upload video. Please try again.";

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });

      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsSuccess(false);
    setVideoKey("");
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Video Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Video Display */}
        {currentVideoUrl && !file && (
          <div className="space-y-2">
            <Label>Current Video</Label>
            <div className="relative bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">Video uploaded</span>
              </div>
              <video
                src={currentVideoUrl}
                controls
                className="w-full mt-3 rounded-md max-h-48"
                preload="metadata"
              />
            </div>
          </div>
        )}

        {/* File Upload Area */}
        {!isSuccess && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() =>
              !disabled && document.getElementById("video-upload")?.click()
            }
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {file ? "File Selected" : "Upload Video"}
            </p>
            {file ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {file.name} ({formatFileSize(file.size)})
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Click to browse or drag and drop video file here
                <br />
                Maximum file size: 100MB
              </p>
            )}

            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  handleFileChange(selectedFile);
                }
              }}
              className="hidden"
              disabled={disabled}
            />
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Uploading...</Label>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Upload Successful</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Video uploaded successfully to: {videoKey}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeFile}
              className="mt-2"
            >
              Upload Another Video
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {file && !isSuccess && (
          <Button
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>
        )}

        {/* Help Text */}
        {!lessonId && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-700">
              Please save the lesson first before uploading video
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
