"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Reply,
  Send,
  X,
  Plus,
} from "lucide-react";

import type {
  QuestionBodyType,
  QuestionUpdateBodyType,
} from "@/schemaValidations/question.schema";
import type { ReplyCreateBody } from "@/schemaValidations/reply.schema";
import type { VoteCreateBodyType } from "@/schemaValidations/vote.schema";
import profileApiRequest from "@/apiRequests/profile";
import { toast } from "@/components/ui/use-toast";
import questionApiRequest from "@/apiRequests/question";
import { voteApiRequests } from "@/apiRequests/vote";
import replyApiRequest from "@/apiRequests/reply";
import Image from "next/image";

// Define types based on schema
type QuestionData = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
  menteeProfile: {
    id: number;
    name: string;
    avatar?: string | null;
    username?: string | null;
  };
  _count: {
    replies: number;
    votes: number;
  };
};

type ReplyData = {
  id: number;
  content: string;
  authorType: string;
  menteeProfileId: number;
  questionId: number;
  parentReplyId?: number | null;
  createdAt: string;
  updatedAt: string;
  menteeProfile: {
    id: number;
    name: string;
    avatar?: string | null;
    username?: string | null;
  };
  _count: {
    votes: number;
    childReplies: number;
  };
};

type VoteData = {
  id: number;
  voteType: string;
  userId: number;
  questionId?: number | null;
  replyId?: number | null;
  createdAt: string;
  user: {
    id: number;
    email: string;
  };
};

type UserProfile = {
  id: number;
  email: string;
  role: string;
  status: string;
  mentee_profile_id: number;
  name: string;
  bio?: string | null;
  location?: string | null;
  username: string;
  avatar?: string | null;
  coverPhoto?: string | null;
  date_of_birth?: string | null;
  website?: string | null;
  phone_number?: string | null;
  description?: string | null;
};

export default function Forum() {
  // States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editingPost, setEditingPost] = useState<QuestionData | null>(null);
  const [expandedComments, setExpandedComments] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [replies, setReplies] = useState<{ [questionId: number]: ReplyData[] }>(
    {}
  );
  const [newComment, setNewComment] = useState<{
    [questionId: number]: string;
  }>({});
  const [editingReply, setEditingReply] = useState<{
    replyId: number;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [replyLoading, setReplyLoading] = useState<{
    [questionId: number]: boolean;
  }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: VoteData }>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    replyId: number;
    questionId: number;
  } | null>(null);
  const [nestedReplyContent, setNestedReplyContent] = useState("");

  // Image preview states
  const [createImagePreview, setCreateImagePreview] = useState<string | null>(
    null
  );
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState<QuestionBodyType>({
    title: "",
    content: "",
    image: undefined,
  });
  const [editQuestion, setEditQuestion] = useState<QuestionUpdateBodyType>({
    title: "",
    content: "",
    image: undefined,
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchQuestions();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await profileApiRequest.getProfile();
      setCurrentUser(response.payload.result);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Cannot load user information",
        variant: "destructive",
      });
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionApiRequest.getQuestions();
      setQuestions(response.payload.data || []);

      // Fetch user votes for all questions
      if (response.payload.data && currentUser) {
        const votePromises = response.payload.data.map((question) =>
          fetchUserVote(question.id)
        );
        await Promise.all(votePromises);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Cannot load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async (questionId?: number, replyId?: number) => {
    try {
      if (!currentUser?.id) return;

      let response;
      if (questionId) {
        response = await voteApiRequests.getVotesByQuestionId(questionId);
      } else if (replyId) {
        response = await voteApiRequests.getVotesByReplyId(replyId);
      } else {
        return;
      }

      const userVote = response.payload.data?.find(
        (vote) => vote.userId === currentUser.id
      );

      if (userVote) {
        const voteKey = questionId
          ? `question_${questionId}`
          : `reply_${replyId}`;
        setUserLikes((prev) => ({ ...prev, [voteKey]: userVote }));
      }
    } catch (error) {
      console.error("Error fetching user vote:", error);
    }
  };

  const fetchReplies = async (questionId: number) => {
    try {
      setReplyLoading((prev) => ({ ...prev, [questionId]: true }));
      const response = await replyApiRequest.getRepliesByQuestionId(questionId);

      const normalizedReplies = (response.payload.data || []).map((reply) => ({
        ...reply,
        _count: {
          votes: reply._count?.votes || 0,
          childReplies: reply._count?.childReplies || 0,
        },
      })) as ReplyData[];

      setReplies((prev) => ({ ...prev, [questionId]: normalizedReplies }));

      // Fetch user votes for all replies
      if (currentUser) {
        for (const reply of normalizedReplies) {
          await fetchUserVote(undefined, reply.id);
        }
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast({
        title: "Error",
        description: "Cannot load comments",
        variant: "destructive",
      });
    } finally {
      setReplyLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleLike = async (questionId?: number, replyId?: number) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    const voteKey = questionId ? `question_${questionId}` : `reply_${replyId}`;
    const existingVote = userLikes[voteKey];

    try {
      if (existingVote) {
        // Unlike: Delete existing vote
        await voteApiRequests.deleteVote(existingVote.id);
        setUserLikes((prev) => {
          const newLikes = { ...prev };
          delete newLikes[voteKey];
          return newLikes;
        });

        // Update vote count
        if (questionId) {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    _count: {
                      ...q._count,
                      votes: Math.max(0, q._count.votes - 1),
                    },
                  }
                : q
            )
          );
        } else if (replyId) {
          setReplies((prev) => {
            const newReplies = { ...prev };
            Object.keys(newReplies).forEach((questionKey) => {
              newReplies[parseInt(questionKey)] = newReplies[
                parseInt(questionKey)
              ].map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      _count: {
                        votes: Math.max(0, reply._count.votes - 1),
                        childReplies: reply._count.childReplies,
                      },
                    }
                  : reply
              );
            });
            return newReplies;
          });
        }
      } else {
        // Like: Create new vote
        const voteData: VoteCreateBodyType = {
          vote_type: "UP",
          question_id: questionId,
          reply_id: replyId,
        };
        const response = await voteApiRequests.createVote(voteData);
        setUserLikes((prev) => ({ ...prev, [voteKey]: response.payload.data }));

        // Update vote count
        if (questionId) {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === questionId
                ? { ...q, _count: { ...q._count, votes: q._count.votes + 1 } }
                : q
            )
          );
        } else if (replyId) {
          setReplies((prev) => {
            const newReplies = { ...prev };
            Object.keys(newReplies).forEach((questionKey) => {
              newReplies[parseInt(questionKey)] = newReplies[
                parseInt(questionKey)
              ].map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      _count: {
                        votes: reply._count.votes + 1,
                        childReplies: reply._count.childReplies,
                      },
                    }
                  : reply
              );
            });
            return newReplies;
          });
        }
      }
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        title: "Error",
        description: "Cannot perform action",
        variant: "destructive",
      });
    }
  };

  const handleCreateNestedReply = async (
    parentReplyId: number,
    questionId: number
  ) => {
    const content = nestedReplyContent.trim();
    if (!content) {
      toast({
        title: "Error",
        description: "Please enter reply content",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to reply",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData: ReplyCreateBody = {
        content,
        question_id: questionId,
        parent_reply_id: parentReplyId,
        author_type: currentUser.role || "MENTEE",
      };

      await replyApiRequest.createReply(replyData);
      setNestedReplyContent("");
      setReplyingTo(null);
      await fetchReplies(questionId);
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

  const handleCreateReply = async (question_id: number) => {
    const content = newComment[question_id]?.trim();
    if (!content) {
      toast({
        title: "Error",
        description: "Please enter comment content",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData: ReplyCreateBody = {
        content,
        question_id,
        parent_reply_id: null,
        author_type: currentUser.role || "MENTEE",
      };

      await replyApiRequest.createReply(replyData);
      setNewComment((prev) => ({ ...prev, [question_id]: "" }));
      await fetchReplies(question_id);
      toast({
        title: "Success",
        description: "Comment added successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "Cannot add comment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReply = async () => {
    if (!editingReply || !editingReply.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter comment content",
        variant: "destructive",
      });
      return;
    }

    try {
      const replyData: ReplyCreateBody = {
        content: editingReply.content,
        question_id: 0, // Will be ignored in update
        author_type: currentUser?.role || "MENTEE",
      };
      await replyApiRequest.updateReply(editingReply.replyId, replyData);
      setEditingReply(null);

      // Refresh replies for all expanded comments
      const refreshPromises = expandedComments.map((questionId) =>
        fetchReplies(questionId)
      );
      await Promise.all(refreshPromises);
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

  const handleDeleteReply = async (replyId: number, questionId: number) => {
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
      await replyApiRequest.deleteReply(replyId);
      await fetchReplies(questionId);
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

  const handleCreateQuestion = async () => {
    if (!newQuestion.title?.trim() || !newQuestion.content?.trim()) {
      toast({
        title: "Error",
        description: "Please enter title and content",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to create post",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);

      // Create FormData for proper multipart request
      const formData = new FormData();
      formData.append("title", newQuestion.title);
      formData.append("content", newQuestion.content);
      if (newQuestion.image) {
        formData.append("image", newQuestion.image);
      }

      // Use FormData instead of the object
      await questionApiRequest.createQuestion(formData as any);
      resetCreateForm();
      await fetchQuestions();
      toast({
        title: "Success",
        description: "Post created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description: "Cannot create post",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateQuestion = async () => {
    if (
      !editQuestion.title?.trim() ||
      !editQuestion.content?.trim() ||
      !editingPost
    ) {
      toast({
        title: "Error",
        description: "Please enter title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("title", editQuestion.title);
      formData.append("content", editQuestion.content);
      if (editQuestion.image) {
        formData.append("image", editQuestion.image);
      }

      await questionApiRequest.updateQuestion(editingPost.id, formData as any);
      resetEditForm();
      await fetchQuestions();
      toast({
        title: "Success",
        description: "Post updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Cannot update post",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this post?",
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
      await questionApiRequest.deleteQuestion(id);
      await fetchQuestions();
      toast({
        title: "Success",
        description: "Post deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Cannot delete post",
        variant: "destructive",
      });
    }
  };

  const resetCreateForm = () => {
    setNewQuestion({ title: "", content: "", image: undefined });
    setCreateImagePreview(null);
    setShowCreatePost(false);
  };

  const resetEditForm = () => {
    setEditQuestion({ title: "", content: "", image: undefined });
    setEditImagePreview(null);
    setEditingPost(null);
    setShowEditPost(false);
  };

  const openEditModal = (question: QuestionData) => {
    setEditingPost(question);
    setEditQuestion({
      title: question.title,
      content: question.content,
      image: undefined,
    });
    setEditImagePreview(question.image);
    setShowEditPost(true);
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
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

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      if (isEdit) {
        setEditQuestion((prev) => ({ ...prev, image: file }));
        setEditImagePreview(previewUrl);
      } else {
        setNewQuestion((prev) => ({ ...prev, image: file }));
        setCreateImagePreview(previewUrl);
      }
    }
  };

  const removeImage = (isEdit = false) => {
    if (isEdit) {
      setEditQuestion((prev) => ({ ...prev, image: undefined }));
      setEditImagePreview(null);
    } else {
      setNewQuestion((prev) => ({ ...prev, image: undefined }));
      setCreateImagePreview(null);
    }
  };

  const toggleComments = async (questionId: number) => {
    const isExpanding = !expandedComments.includes(questionId);
    setExpandedComments((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );

    if (isExpanding && !replies[questionId]) {
      await fetchReplies(questionId);
    }
  };

  const isLiked = (questionId?: number, replyId?: number) => {
    const voteKey = questionId ? `question_${questionId}` : `reply_${replyId}`;
    return !!userLikes[voteKey];
  };

  const canEditOrDelete = (authorId: number) => {
    return currentUser?.mentee_profile_id === authorId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderNestedReplies = (
    parentReplyId: number,
    questionId: number,
    level = 0
  ) => {
    const childReplies =
      replies[questionId]?.filter(
        (reply) => reply.parentReplyId === parentReplyId
      ) || [];

    if (childReplies.length === 0) return null;

    return (
      <div className={`ml-${Math.min(level * 4, 12)} space-y-3`}>
        {childReplies.map((childReply) => (
          <div
            key={childReply.id}
            className="bg-gray-50 rounded-lg p-4 border-l-2 border-blue-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Image
                  src={
                    childReply.menteeProfile.avatar ||
                    "/images/default-avatar.png"
                  }
                  width={32}
                  height={32}
                  alt={childReply.menteeProfile.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {childReply.menteeProfile.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {formatDate(childReply.createdAt)}
                  </p>
                </div>
              </div>
              {canEditOrDelete(childReply.menteeProfileId) && (
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setEditingReply({
                        replyId: childReply.id,
                        content: childReply.content,
                      })
                    }
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteReply(childReply.id, questionId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {editingReply?.replyId === childReply.id ? (
              <div className="space-y-3">
                <textarea
                  value={editingReply.content}
                  onChange={(e) =>
                    setEditingReply({
                      ...editingReply,
                      content: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateReply}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingReply(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-3">{childReply.content}</p>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(undefined, childReply.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      isLiked(undefined, childReply.id)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={
                        isLiked(undefined, childReply.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                    <span>{childReply._count.votes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setReplyingTo({ replyId: childReply.id, questionId })
                    }
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Reply size={16} />
                    <span>Reply</span>
                  </button>
                </div>

                {replyingTo?.replyId === childReply.id && (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={nestedReplyContent}
                      onChange={(e) => setNestedReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleCreateNestedReply(childReply.id, questionId)
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <Send size={16} />
                        <span>Send</span>
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setNestedReplyContent("");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {renderNestedReplies(childReply.id, questionId, level + 1)}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Discussion Forum
          </h1>
          <p className="text-gray-600">
            Share knowledge and connect with the community
          </p>
        </div>

        {/* Create Post Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full p-4 bg-gray-50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group"
          >
            <div className="flex items-center justify-center space-x-3 text-gray-500 group-hover:text-blue-500">
              <Plus size={24} />
              <span className="text-lg font-medium">Create new post</span>
            </div>
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={
                        question.menteeProfile.avatar ||
                        "/images/default-avatar.png"
                      }
                      width={48}
                      height={48}
                      alt={question.menteeProfile.name}
                      className="w-12 h-12 rounded-full"
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
                        onClick={() => openEditModal(question)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
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
                <p className="text-gray-700 leading-relaxed">
                  {question.content}
                </p>
                {question.image && (
                  <div className="mt-4">
                    <Image
                      src={question.image}
                      width={600}
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
                    onClick={() => handleLike(question.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked(question.id)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={isLiked(question.id) ? "currentColor" : "none"}
                    />
                    <span className="font-medium">{question._count.votes}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(question.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span className="font-medium">
                      {question._count.replies}
                    </span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments.includes(question.id) && (
                <div className="p-6">
                  {/* Add Comment */}
                  <div className="mb-6">
                    <div className="flex space-x-3">
                      <Image
                        src={
                          currentUser?.avatar || "/images/default-avatar.png"
                        }
                        width={40}
                        height={40}
                        alt="Your avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment[question.id] || ""}
                          onChange={(e) =>
                            setNewComment((prev) => ({
                              ...prev,
                              [question.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a comment..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                        <button
                          onClick={() => handleCreateReply(question.id)}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                        >
                          <Send size={16} />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
                  {replyLoading[question.id] ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {replies[question.id]
                        ?.filter((reply) => !reply.parentReplyId)
                        .map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={
                                    reply.menteeProfile.avatar ||
                                    "/images/default-avatar.png"
                                  }
                                  width={40}
                                  height={40}
                                  alt={reply.menteeProfile.name}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {reply.menteeProfile.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </p>
                                </div>
                              </div>
                              {canEditOrDelete(reply.menteeProfileId) && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      setEditingReply({
                                        replyId: reply.id,
                                        content: reply.content,
                                      })
                                    }
                                    className="text-gray-400 hover:text-blue-500"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(reply.id, question.id)
                                    }
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingReply?.replyId === reply.id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={editingReply.content}
                                  onChange={(e) =>
                                    setEditingReply({
                                      ...editingReply,
                                      content: e.target.value,
                                    })
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={handleUpdateReply}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => setEditingReply(null)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-gray-700 mb-3">
                                  {reply.content}
                                </p>

                                <div className="flex items-center space-x-4">
                                  <button
                                    onClick={() =>
                                      handleLike(undefined, reply.id)
                                    }
                                    className={`flex items-center space-x-1 transition-colors ${
                                      isLiked(undefined, reply.id)
                                        ? "text-red-500"
                                        : "text-gray-500 hover:text-red-500"
                                    }`}
                                  >
                                    <Heart
                                      size={16}
                                      fill={
                                        isLiked(undefined, reply.id)
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                    <span>{reply._count.votes}</span>
                                  </button>

                                  <button
                                    onClick={() =>
                                      setReplyingTo({
                                        replyId: reply.id,
                                        questionId: question.id,
                                      })
                                    }
                                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                                  >
                                    <Reply size={16} />
                                    <span>Reply</span>
                                  </button>
                                </div>

                                {replyingTo?.replyId === reply.id && (
                                  <div className="mt-3 space-y-3">
                                    <textarea
                                      value={nestedReplyContent}
                                      onChange={(e) =>
                                        setNestedReplyContent(e.target.value)
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      rows={3}
                                    />
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          handleCreateNestedReply(
                                            reply.id,
                                            question.id
                                          )
                                        }
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                      >
                                        <Send size={16} />
                                        <span>Send</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setReplyingTo(null);
                                          setNestedReplyContent("");
                                        }}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                                      >
                                        <X size={16} />
                                        <span>Cancel</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {renderNestedReplies(reply.id, question.id)}
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Post
                  </h2>
                  <button
                    onClick={resetCreateForm}
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
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
                    value={newQuestion.content}
                    onChange={(e) =>
                      setNewQuestion((prev) => ({
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
                      onChange={(e) => handleImageUpload(e, false)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {createImagePreview && (
                      <button
                        onClick={() => removeImage(false)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  {createImagePreview && (
                    <div className="mt-3">
                      <Image
                        src={createImagePreview}
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
                  onClick={handleCreateQuestion}
                  disabled={creating}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Post"}
                </button>
                <button
                  onClick={resetCreateForm}
                  className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Post Modal */}
        {showEditPost && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Post
                  </h2>
                  <button
                    onClick={resetEditForm}
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
                      setEditQuestion((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
                      onChange={(e) => handleImageUpload(e, true)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editImagePreview && (
                      <button
                        onClick={() => removeImage(true)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  {editImagePreview && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">
                        {editQuestion.image
                          ? "New image preview:"
                          : "Current image:"}
                      </p>
                      <Image
                        src={editImagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg border border-gray-200"
                        width={600}
                        height={400}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex space-x-4">
                <button
                  onClick={handleUpdateQuestion}
                  disabled={updating}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Post"}
                </button>
                <button
                  onClick={resetEditForm}
                  className="flex-1 py-3 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
