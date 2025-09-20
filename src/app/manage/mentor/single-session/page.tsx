"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search } from "lucide-react";
import { useSingleSessions } from "@/queries/useSingleSession";
import { SingleSessionList } from "./single-session-list";
import { SingleSessionForm } from "./single-session-form";
import { SingleSessionType } from "@/schemaValidations/singleSession.schema";
import { useFetchProfile, useProfile } from "@/stores";

export default function SingleSessionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<SingleSessionType>();
  const profile = useProfile();
  const fetchProfile = useFetchProfile();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);
  const mentorProfileId = profile?.mentor_profile_id;
  const { data, isLoading, error } = useSingleSessions(
    mentorProfileId as number
  );

  const sessions = data?.payload || [];

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingSession(undefined);
    setShowForm(true);
  };

  const handleEdit = (session: SingleSessionType) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSession(undefined);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600">Error</h3>
              <p className="text-sm text-gray-500 mt-2">
                Failed to load single sessions. Please try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-500">
            Single Sessions
          </h1>
          <p className="text-muted-foreground">
            Manage your single session offerings
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="md:w-auto bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Session
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading sessions...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>
              Sessions {searchTerm && `(${filteredSessions.length} filtered)`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SingleSessionList
              sessions={filteredSessions}
              onEdit={handleEdit}
            />
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <SingleSessionForm
        open={showForm}
        onOpenChange={handleCloseForm}
        editingSession={editingSession}
      />
    </div>
  );
}
