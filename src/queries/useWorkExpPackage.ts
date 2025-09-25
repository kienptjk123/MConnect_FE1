import workExpPackageApiRequest from "@/apiRequests/work-exp-package";
import {
  WorkExperiencePackageCreateInput,
  WorkExperiencePackageUpdateInput,
} from "@/schemaValidations/work-exp-package.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkExpPackages = () => {
  return useQuery({
    queryKey: ["workExpPackages"],
    queryFn: () => workExpPackageApiRequest.getWorkExpPackages(),
  });
};

export const useWorkExpPackageById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["workExpPackage", id],
    queryFn: () => workExpPackageApiRequest.getWorkExpPackageById(id),
    enabled: enabled && !!id,
  });
};

export const useCreateWorkExpPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkExperiencePackageCreateInput) =>
      workExpPackageApiRequest.createWorkExpPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExpPackages"] });
    },
  });
};

export const useUpdateWorkExpPackage = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkExperiencePackageUpdateInput) =>
      workExpPackageApiRequest.updateWorkExpPackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExpPackages"] });
    },
  });
};

export const useDeleteWorkExpPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      workExpPackageApiRequest.deleteWorkExpPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workExpPackages"] });
    },
  });
};
