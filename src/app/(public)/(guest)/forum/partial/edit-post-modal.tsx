"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import {
  QuestionData,
  QuestionUpdateBodyType,
} from "@/schemaValidations/question.schema";

interface EditPostModalProps {
  isOpen: boolean;
  question: QuestionData | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}

export default function EditPostModal({
  isOpen,
  question,
  onClose,
  onSubmit,
  loading,
}: EditPostModalProps) {
  const [editQuestion, setEditQuestion] = useState<QuestionUpdateBodyType>({
    title: "",
    content: "",
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setEditQuestion({
        title: question.title,
        content: question.content,
        image: undefined,
      });
      setImagePreview(question.image || null);
    }
  }, [question]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setEditQuestion((prev) => ({ ...prev, image: file }));
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setEditQuestion((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!editQuestion.title?.trim() || !editQuestion.content?.trim()) {
      toast({
        title: "Error",
        description: "Please enter title and content",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", editQuestion.title);
    formData.append("content", editQuestion.content);
    if (editQuestion.image) {
      formData.append("image", editQuestion.image);
    }

    await onSubmit(formData);
  };

  const resetForm = () => {
    setEditQuestion({ title: "", content: "", image: undefined });
    setImagePreview(null);
    onClose();
  };

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={editQuestion.title}
              onChange={(e) =>
                setEditQuestion((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={editQuestion.content}
              onChange={(e) =>
                setEditQuestion((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="Enter post content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imagePreview && (
                <button
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">
                  {editQuestion.image ? "New image preview:" : "Current image:"}
                </p>
                <Image
                  src={imagePreview}
                  width={600}
                  height={400}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
          <button
            onClick={resetForm}
            className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
