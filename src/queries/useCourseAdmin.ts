import { courseAdminApiRequest } from "@/apiRequests/courseAdmin";
import { AdminUpdateCourseType } from "@/schemaValidations/course.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCoursesAdminQuery = () => {
  return useQuery({
    queryKey: ["courses", "admin"],
    queryFn: () => courseAdminApiRequest.getAllCoursesByAdmin(),
  });
};

export const useCourseByIdAdminQuery = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["course", "admin", id],
    queryFn: () => courseAdminApiRequest.getCourseByIdByAdmin(id),
    enabled: enabled && !!id,
  });
};

export const useUpdateCourseStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AdminUpdateCourseType }) =>
      courseAdminApiRequest.updateCoursesStatusByAdmin(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", "admin"] });
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseAdminApiRequest.deleteCourseByAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", "admin"] });
    },
  });
};
