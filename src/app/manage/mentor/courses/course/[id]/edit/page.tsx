import EditForm from "@/app/manage/mentor/courses/course/[id]/edit/edit-form";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  return <EditForm courseId={parseInt(id)} />;
}
