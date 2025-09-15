import Loading from "@/app/loading";
import ProfileForm from "@/app/manage/mentee/profile/profile-form";
import React, { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileForm />
    </Suspense>
  );
}
