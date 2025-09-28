"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Plus } from "lucide-react";
import { useSingleSessions } from "@/queries/useSingleSession";
import SingleSessionTable from "./single-session-table";
import { SingleSessionForm } from "./single-session-form";
import { SingleSessionType } from "@/schemaValidations/singleSession.schema";
import { useFetchProfile, useProfile } from "@/stores";

export default function SingleSessionPage() {
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
  const { data, isLoading, isError } = useSingleSessions(
    mentorProfileId as number
  );

  const sessions = data?.payload || [];

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

  return (
    <div className="mx-auto min-w-7xl p-6">
      <Card className="rounded-md shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between bg-blue-500 text-white dark:bg-black p-6 rounded-t-md">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-white/20 p-2 border border-white/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Single Session Management
              </CardTitle>
              <p className="text-sm opacity-90">
                Manage your single session offerings efficiently
              </p>
            </div>
          </div>

          <Button
            onClick={handleAddNew}
            className="gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white border border-white/20"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Session</span>
          </Button>
        </CardHeader>

        <Separator />
        <CardContent className="p-6">
          {isLoading && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
              </div>
            </div>
          )}
          {isError && (
            <div className="py-16 text-center">
              <div className="inline-flex flex-col items-center gap-3 text-red-600">
                <div className="rounded-md bg-red-50 p-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>Failed to load sessions. Please try again.</span>
              </div>
            </div>
          )}
          {Array.isArray(sessions) && (
            <SingleSessionTable
              data={sessions}
              onEdit={handleEdit}
              onAddNew={handleAddNew}
            />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <SingleSessionForm
        open={showForm}
        onOpenChange={handleCloseForm}
        editingSession={editingSession}
      />
    </div>
  );
}
