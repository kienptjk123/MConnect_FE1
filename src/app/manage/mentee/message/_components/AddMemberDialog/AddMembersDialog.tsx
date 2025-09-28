import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Search, Plus, Users } from "lucide-react";
import { UserType } from "@/schemaValidations/friends.schema";
import {
  Conversation,
  ConversationMember,
} from "@/schemaValidations/chat.schema";
import { useFriends, useFetchFriends } from "@/stores/friendsStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversation: Conversation;
  onAddMembers: (memberIds: number[]) => void;
  isLoading?: boolean;
}

export const AddMembersDialog: React.FC<AddMembersDialogProps> = ({
  open,
  onOpenChange,
  conversation,
  onAddMembers,
  isLoading = false,
}) => {
  const [selectedMembers, setSelectedMembers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const friends = useFriends();
  const fetchFriends = useFetchFriends();

  // Get current conversation member IDs
  const currentMemberIds = new Set(
    conversation.members?.map((member: ConversationMember) => member.user.id) ||
      []
  );

  useEffect(() => {
    if (open && friends.length === 0) {
      fetchFriends();
    }
  }, [open, friends.length, fetchFriends]);

  // Helper functions defined before use
  const getFriendName = (friend: UserType) => {
    return (
      friend.menteeProfiles?.name ||
      friend.mentorProfiles?.name ||
      friend.adminProfiles?.name ||
      friend.StaffProfile?.name ||
      "Unknown User"
    );
  };

  const getFriendAvatar = (friend: UserType) => {
    return (
      friend.menteeProfiles?.avatar ||
      friend.mentorProfiles?.avatar ||
      friend.adminProfiles?.avatar ||
      friend.StaffProfile?.avatar ||
      null
    );
  };

  const getFriendRole = (friend: UserType) => {
    return friend.role?.toLowerCase() || "user";
  };

  // Filter friends who are not already in the conversation
  const availableFriends = friends.filter(
    (friend) => !currentMemberIds.has(friend.id)
  );

  const filteredFriends = availableFriends.filter((friend) => {
    const name = getFriendName(friend);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleMember = (friend: UserType) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((member) => member.id === friend.id);
      if (isSelected) {
        return prev.filter((member) => member.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const removeMember = (friendId: number) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member.id !== friendId)
    );
  };

  const handleAddMembers = () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 1 thành viên để thêm",
        variant: "destructive",
      });
      return;
    }

    const memberIds = selectedMembers.map((member) => member.id);
    onAddMembers(memberIds);
  };

  const handleClose = () => {
    setSelectedMembers([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Users className="h-5 w-5" />
            Add Members to {conversation.title || "Group"}
          </DialogTitle>
          <div className="text-sm text-gray-500">
            Current members: {conversation.members?.length || 0}
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Selected Members ({selectedMembers.length})
                </Label>
              </div>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg max-h-24 overflow-y-auto">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={getFriendAvatar(member) || undefined} />
                      <AvatarFallback className="text-xs">
                        {getFriendName(member).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getFriendName(member)}</span>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Members Section */}
          <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
            <Label className="text-sm font-medium">Available Friends</Label>
            <div className="text-xs text-gray-500 mb-2">
              Search and add friends to this group
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Friends List */}
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-2 space-y-1">
                {filteredFriends.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">
                      {availableFriends.length === 0
                        ? "All friends are already in this group"
                        : "No friends found"}
                    </div>
                  </div>
                ) : (
                  filteredFriends.map((friend) => {
                    const isSelected = selectedMembers.some(
                      (member) => member.id === friend.id
                    );
                    return (
                      <div
                        key={friend.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50 border border-blue-200" : ""
                        }`}
                        onClick={() => toggleMember(friend)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getFriendAvatar(friend) || undefined}
                            />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {getFriendName(friend).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {getFriendName(friend)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {friend.email}
                            </div>
                          </div>
                          <Badge
                            variant={
                              getFriendRole(friend) === "mentor"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {getFriendRole(friend)}
                          </Badge>
                        </div>
                        <div className="ml-2">
                          {isSelected ? (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <X className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-blue-500">
                              <Plus className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={isLoading || selectedMembers.length === 0}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isLoading
              ? "Adding..."
              : `Add ${selectedMembers.length} Member${
                  selectedMembers.length > 1 ? "s" : ""
                }`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
