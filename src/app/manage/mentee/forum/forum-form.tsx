"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import type {
  QuestionData,
  QuestionUpdateBodyType,
} from "@/schemaValidations/question.schema";
import type { VoteCreateBodyType } from "@/schemaValidations/vote.schema";
import type { UserProfile } from "@/schemaValidations/profile.schema";
import profileApiRequest from "@/apiRequests/profile";
import { toast } from "@/components/ui/use-toast";
import questionApiRequest from "@/apiRequests/question";
import { voteApiRequests } from "@/apiRequests/vote";
import PostCard from "@/app/manage/mentee/forum/partial/post-card";
import CreatePostModal from "@/app/manage/mentee/forum/partial/create-post-modal";
import EditPostModal from "@/app/manage/mentee/forum/partial/edit-post-modal";
import Swal from "sweetalert2";

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

export default function Forum() {
  // States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [editingPost, setEditingPost] = useState<QuestionData | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [userLikes, setUserLikes] = useState<{ [key: string]: VoteData }>({});
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchQuestions();
  }, []);

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

  const handleLike = async (questionId: number) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    const voteKey = `question_${questionId}`;
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
      } else {
        // Like: Create new vote
        const voteData: VoteCreateBodyType = {
          vote_type: "UP",
          question_id: questionId,
        };
        const response = await voteApiRequests.createVote(voteData);
        setUserLikes((prev) => ({ ...prev, [voteKey]: response.payload.data }));

        // Update vote count
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? { ...q, _count: { ...q._count, votes: q._count.votes + 1 } }
              : q
          )
        );
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

  const handleCreateQuestion = async (formData: FormData) => {
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
      await questionApiRequest.createQuestion(formData as any);
      setShowCreatePost(false);
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

  const handleUpdateQuestion = async (formData: FormData) => {
    if (!editingPost) {
      toast({
        title: "Error",
        description: "No post selected for editing",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdating(true);
      await questionApiRequest.updateQuestion(editingPost.id, formData as any);
      setShowEditPost(false);
      setEditingPost(null);
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

  const openEditModal = (question: QuestionData) => {
    setEditingPost(question);
    setShowEditPost(true);
  };

  const closeCreateModal = () => {
    setShowCreatePost(false);
  };

  const closeEditModal = () => {
    setShowEditPost(false);
    setEditingPost(null);
  };

  const isLiked = (questionId: number) => {
    const voteKey = `question_${questionId}`;
    return !!userLikes[voteKey];
  };

  const canEditOrDelete = (authorId: number) => {
    return currentUser?.mentee_profile_id === authorId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">
            Discussion Forum
          </h1>
          <p className="text-gray-600">
            Share knowledge and connect with the community
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full p-4 bg-gray-50 rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group hover:cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-1 text-gray-500 group-hover:text-blue-500">
              <Plus size={24} />
              <span className="text-lg font-medium">Create new post</span>
            </div>
          </button>
        </div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts found. Be the first to create one!
              </p>
            </div>
          ) : (
            questions.map((question) => (
              <PostCard
                key={question.id}
                question={question}
                currentUser={currentUser}
                isLiked={isLiked(question.id)}
                onLike={handleLike}
                onEdit={openEditModal}
                onDelete={handleDeleteQuestion}
                canEditOrDelete={canEditOrDelete}
              />
            ))
          )}
        </div>

        <CreatePostModal
          isOpen={showCreatePost}
          onClose={closeCreateModal}
          onSubmit={handleCreateQuestion}
          loading={creating}
        />

        <EditPostModal
          isOpen={showEditPost}
          question={editingPost}
          onClose={closeEditModal}
          onSubmit={handleUpdateQuestion}
          loading={updating}
        />
      </div>
    </div>
  );
}
