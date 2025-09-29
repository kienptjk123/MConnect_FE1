"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Edit, Trash2, Reply, Send, X } from "lucide-react";
import Swal from "sweetalert2";
import replyApiRequest from "@/apiRequests/reply";
import { voteApiRequests } from "@/apiRequests/vote";
import { toast } from "@/components/ui/use-toast";
import { ReplyData } from "@/schemaValidations/reply.schema";
import { UserProfile } from "@/schemaValidations/profile.schema";
import { formatDate } from "@/lib/utils";

interface CommentItemProps {
  reply: ReplyData;
  questionId: number;
  allReplies: ReplyData[];
  currentUser: UserProfile | null;
  canEditOrDelete: (authorId: number) => boolean;
  onRefresh: () => void;
  level?: number;
}

export default function CommentItem({
  reply,
  questionId,
  allReplies,
  currentUser,
  canEditOrDelete,
  onRefresh,
  level = 0,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [voteCount, setVoteCount] = useState(reply._count.votes);
  const [showChildReplies, setShowChildReplies] = useState(true);

  // Get child replies for this comment
  const childReplies = allReplies.filter((r) => r.parentReplyId === reply.id);
  const hasChildReplies = childReplies.length > 0;

  useEffect(() => {
    checkUserVote();
  }, [reply.id, currentUser]);

  const checkUserVote = async () => {
    if (!currentUser || !reply.id) return;

    try {
      const response = await voteApiRequests.getVotesByReplyId(reply.id);
      const userVote = response.payload.data?.find(
        (vote) => vote.userId === currentUser.id
      );
      setIsLiked(!!userVote);
    } catch (error) {
      console.error("Error checking user vote:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Please login to comment on posts",
        description: "Please login to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        // Get existing vote and delete it
        const response = await voteApiRequests.getVotesByReplyId(reply.id);
        const userVote = response.payload.data?.find(
          (vote) => vote.userId === currentUser.id
        );

        if (userVote) {
          await voteApiRequests.deleteVote(userVote.id);
          setVoteCount(Math.max(0, voteCount - 1));
          setIsLiked(false);
        }
      } else {
        const voteData = {
          vote_type: "UP" as const,
          reply_id: reply.id,
        };
        await voteApiRequests.createVote(voteData);
        setVoteCount(voteCount + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        title: "Please login to comment on posts",
        description: "Cannot perform action",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    const content = editContent.trim();
    if (!content) {
      toast({
        title: "Error",
        description: "Please enter comment content",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData = {
        content,
        question_id: questionId,
        author_type: currentUser?.role || "MENTEE",
      };
      await replyApiRequest.updateReply(reply.id, replyData);
      setIsEditing(false);
      onRefresh();
      toast({
        title: "Success",
        description: "Comment updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating reply:", error);
      toast({
        title: "Error",
        description: "Cannot update comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await replyApiRequest.deleteReply(reply.id);
      onRefresh();
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast({
        title: "Error",
        description: "Cannot delete comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    const content = replyContent.trim();
    if (!content) {
      toast({
        title: "Please login to comment on posts",
        description: "Please enter reply content",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Please login to comment on posts",
        description: "Please login to reply",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData = {
        content,
        question_id: questionId,
        parent_reply_id: reply.id,
        author_type: currentUser.role || "MENTEE",
      };

      await replyApiRequest.createReply(replyData);
      setReplyContent("");
      setIsReplying(false);
      setShowChildReplies(true); // Show child replies when new reply is added
      onRefresh();
      toast({
        title: "Success",
        description: "Reply added successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating nested reply:", error);
      toast({
        title: "Error",
        description: "Cannot add reply",
        variant: "destructive",
      });
    }
  };

  const toggleChildReplies = () => {
    setShowChildReplies(!showChildReplies);
  };

  // Calculate margin based on nesting level, with a maximum to prevent excessive indentation
  const marginClass = level > 0 ? `ml-${Math.min(level * 6, 24)}` : "";

  return (
    <div className={marginClass}>
      <div
        className={`${
          level > 0
            ? "bg-gray-50 border-l-4 border-blue-200 pl-4"
            : "bg-gray-50"
        } rounded-lg p-4 ${level > 2 ? "bg-gray-100" : ""}`}
      >
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Image
              src={reply.menteeProfile?.avatar || "/images/default-avatar.png"}
              width={40}
              height={40}
              alt={reply.menteeProfile?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">
                {reply.menteeProfile?.name || "Unknown User"}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(reply.createdAt)}
                {level > 0 && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Reply
                  </span>
                )}
              </p>
            </div>
          </div>

          {canEditOrDelete(reply.menteeProfileId) && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Edit comment"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete comment"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Edit your comment..."
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(reply.content);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 mb-3 leading-relaxed">
              {reply.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
                title={isLiked ? "Unlike" : "Like"}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                <span className="font-medium">{voteCount}</span>
              </button>

              {level < 3 && ( // Limit nesting to 3 levels
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Reply to comment"
                >
                  <Reply size={16} />
                  <span>Reply</span>
                </button>
              )}

              {hasChildReplies && (
                <button
                  onClick={toggleChildReplies}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-sm"
                >
                  <span>
                    {showChildReplies ? "Hide" : "Show"} {childReplies.length}
                    {childReplies.length === 1 ? " reply" : " replies"}
                  </span>
                </button>
              )}
            </div>

            {/* Reply Input */}
            {isReplying && (
              <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex items-start space-x-3">
                  <Image
                    src={currentUser?.avatar || "/images/default-avatar.png"}
                    width={32}
                    height={32}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${
                        reply.menteeProfile?.name || "this comment"
                      }...`}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex space-x-2 ml-11">
                  <button
                    onClick={handleReply}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send Reply</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsReplying(false);
                      setReplyContent("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nested Child Replies */}
      {hasChildReplies && showChildReplies && (
        <div className="mt-3 space-y-3">
          {childReplies
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ) // Sort by creation time
            .map((childReply) => (
              <CommentItem
                key={childReply.id}
                reply={childReply}
                questionId={questionId}
                allReplies={allReplies}
                currentUser={currentUser}
                canEditOrDelete={canEditOrDelete}
                onRefresh={onRefresh}
                level={level + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}
