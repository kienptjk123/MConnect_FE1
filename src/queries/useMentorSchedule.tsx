import mentorScheduleApiRequest from "@/apiRequests/mentorSchedule";
import { MentorScheduleUpdateType } from "@/schemaValidations/mentorSchedule.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMentorSchedules = (mentorProfileId: number) => {
  return useQuery({
    queryKey: ["mentorSchedules", mentorProfileId],
    queryFn: () =>
      mentorScheduleApiRequest.getAllMentorSchedules(mentorProfileId),
    enabled: !!mentorProfileId,
  });
};

export const useCreateMentorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mentorScheduleApiRequest.createMentorSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorSchedules"] });
    },
  });
};

export const useUpdateMentorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: MentorScheduleUpdateType;
    }) => mentorScheduleApiRequest.updateMentorSchedule(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorSchedules"] });
    },
  });
};

export const useDeleteMentorSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      mentorScheduleApiRequest.deleteMentorSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorSchedules"] });
    },
  });
};
