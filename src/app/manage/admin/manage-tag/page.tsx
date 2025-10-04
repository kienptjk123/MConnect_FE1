import Loading from "@/app/loading";
import TagManagementPage from "@/app/manage/admin/manage-tag/tag-form";
import { Suspense } from "react";

export default function TagManagement() {
  return (
    <Suspense fallback={<Loading />}>
      <TagManagementPage />
    </Suspense>
  );
}
