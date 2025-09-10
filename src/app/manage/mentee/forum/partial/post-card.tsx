"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Edit, Trash2 } from "lucide-react";
import { QuestionData } from "@/schemaValidations/question.schema";
import { UserProfile } from "@/schemaValidations/profile.schema";
import { formatDate } from "@/lib/utils";
import CommentSection from "@/app/manage/mentee/forum/partial/comment-section";

interface PostCardProps {
  question: QuestionData;
  currentUser: UserProfile | null;
  isLiked: boolean;
  onLike: (questionId: number) => void;
  onEdit: (question: QuestionData) => void;
  onDelete: (questionId: number) => void;
  canEditOrDelete: (authorId: number) => boolean;
}

export default function PostCard({
  question,
  currentUser,
  isLiked,
  onLike,
  onEdit,
  onDelete,
  canEditOrDelete,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Image
              src={
                question.menteeProfile.avatar || "/images/default-avatar.png"
              }
              width={60}
              height={60}
              alt={question.menteeProfile.name}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {question.menteeProfile.name}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(question.createdAt)}
              </p>
            </div>
          </div>
          {canEditOrDelete(question.menteeProfile.id) && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(question)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(question.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {question.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">{question.content}</p>
        {question.image && (
          <div className="mt-4 flex justify-center">
            <Image
              src={question.image}
              width={400}
              height={400}
              alt="Post image"
              className="rounded-lg max-w-full h-auto shadow-md"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onLike(question.id)}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span className="font-medium">{question._count.votes}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-medium">{question._count.replies}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          questionId={question.id}
          currentUser={currentUser}
          canEditOrDelete={canEditOrDelete}
        />
      )}
    </div>
  );
}
