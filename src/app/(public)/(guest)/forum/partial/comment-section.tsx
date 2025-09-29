"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import replyApiRequest from "@/apiRequests/reply";
import { toast } from "@/components/ui/use-toast";
import { UserProfile } from "@/schemaValidations/profile.schema";
import { ReplyData } from "@/schemaValidations/reply.schema";
import CommentItem from "@/app/(public)/(guest)/forum/partial/comment-item";

interface CommentSectionProps {
  questionId: number;
  currentUser: UserProfile | null;
  canEditOrDelete: (authorId: number) => boolean;
}

export default function CommentSection({
  questionId,
  currentUser,
  canEditOrDelete,
}: CommentSectionProps) {
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReplies();
  }, [questionId]);

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await replyApiRequest.getRepliesByQuestionId(questionId);
      const normalizedReplies = (response.payload.data || []).map((reply) => ({
        ...reply,
        _count: {
          votes: reply._count?.votes || 0,
          childReplies: reply._count?.childReplies || 0,
        },
      })) as ReplyData[];
      setReplies(normalizedReplies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast({
        title: "Error",
        description: "Cannot load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReply = async () => {
    const content = newComment.trim();
    if (!content) {
      toast({
        title: "Please login to comment on posts",
        description: "Please enter comment content",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Please login to comment on posts",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData = {
        content,
        question_id: questionId,
        parent_reply_id: null,
        author_type: currentUser.role || "MENTEE",
      };

      await replyApiRequest.createReply(replyData);
      setNewComment("");
      await fetchReplies();
      toast({
        title: "Success",
        description: "Comment added successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      toast({
        title: "Please login to comment on posts",
        description: "Cannot add comment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Add Comment */}
      <div className="mb-6">
        <div className="flex space-x-3">
          <Image
            src={currentUser?.avatar || "/images/default-avatar.png"}
            width={40}
            height={40}
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleCreateReply}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {replies
          .filter((reply) => !reply.parentReplyId)
          .map((reply) => (
            <CommentItem
              key={reply.id}
              reply={reply}
              questionId={questionId}
              allReplies={replies}
              currentUser={currentUser}
              canEditOrDelete={canEditOrDelete}
              onRefresh={fetchReplies}
            />
          ))}
      </div>
    </div>
  );
}
