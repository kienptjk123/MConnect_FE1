"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import staffApiRequest from "@/apiRequests/staff";
import {
  StaffType,
  UpdateStaffProfileType,
} from "@/schemaValidations/staff.schema";

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: () => staffApiRequest.getAllStaff(),
    select: (data) => data.payload.result,
  });
};

export const useStaffByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffApiRequest.getStaffById(id),
    select: (data) => data.payload.result[0],
    enabled: !!id,
  });
};

// Create staff mutation
export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApiRequest.registerStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member created successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create staff member",
        variant: "destructive",
      });
    },
  });
};

// Update staff mutation
export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStaffProfileType }) =>
      staffApiRequest.updateStaff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", variables.id] });
      toast({
        title: "Success",
        description: "Staff member updated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    },
  });
};

// Delete staff mutation
export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => staffApiRequest.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member",
        variant: "destructive",
      });
    },
  });
};
