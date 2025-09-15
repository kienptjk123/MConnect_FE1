import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/SocketProvider";
import {
  useCreateDirectConversation,
  useGetConversations,
} from "@/queries/useChat";
import { useProfile } from "@/stores/profileStore";

export const ChatTestComponent: React.FC = () => {
  const [testUserId, setTestUserId] = useState("");
  const [testMessage, setTestMessage] = useState("Hello from chat test!");

  const {
    connected,
    connectionStatus,
    lastError,
    reinitializeSocket,
    sendMessage,
  } = useSocket();

  const profile = useProfile();
  const createConversation = useCreateDirectConversation();
  const { data: conversationsData } = useGetConversations({
    page: 1,
    limit: 10,
  });

  const handleCreateConversation = () => {
    const userId = parseInt(testUserId);
    if (userId && userId !== profile?.id) {
      createConversation.mutate({
        participantId: userId,
        title: `Chat with User ${userId}`,
      });
    }
  };

  const handleSendTestMessage = () => {
    const conversationId = 1; // Test với conversation ID = 1
    if (testMessage.trim()) {
      sendMessage(conversationId, testMessage);
      setTestMessage("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Socket & Chat Test
          <Badge className={`${getStatusColor(connectionStatus)} text-white`}>
            {connectionStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Socket Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Socket Status:</h3>
          <div className="text-sm space-y-1">
            <div>Connected: {connected ? "✅ Yes" : "❌ No"}</div>
            <div>Status: {connectionStatus}</div>
            {lastError && (
              <div className="text-red-600">Error: {lastError}</div>
            )}
          </div>
          <Button onClick={reinitializeSocket} size="sm">
            Reconnect Socket
          </Button>
        </div>

        {/* User Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">Current User:</h3>
          <div className="text-sm">ID: {profile?.id || "Not logged in"}</div>
        </div>

        {/* Create Conversation Test */}
        <div className="space-y-2">
          <h3 className="font-semibold">Create Direct Conversation:</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter user ID to chat with"
              value={testUserId}
              onChange={(e) => setTestUserId(e.target.value)}
              type="number"
            />
            <Button
              onClick={handleCreateConversation}
              disabled={createConversation.isPending || !testUserId}
            >
              Create Chat
            </Button>
          </div>
          {createConversation.isPending && (
            <div className="text-sm text-blue-600">Creating...</div>
          )}
        </div>

        {/* Send Message Test */}
        <div className="space-y-2">
          <h3 className="font-semibold">Send Test Message:</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Enter message to send"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
            />
            <Button
              onClick={handleSendTestMessage}
              disabled={!connected || !testMessage.trim()}
            >
              Send via Socket
            </Button>
          </div>
        </div>

        {/* Conversations */}
        <div className="space-y-2">
          <h3 className="font-semibold">Current Conversations:</h3>
          <div className="text-sm">
            Count: {conversationsData?.payload.result.conversations.length || 0}
          </div>
          {conversationsData?.payload.result.conversations
            .slice(0, 3)
            .map((conv) => (
              <div key={conv.id} className="text-xs bg-gray-100 p-2 rounded">
                ID: {conv.id} | Type: {conv.type} | Title: {conv.title}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};
