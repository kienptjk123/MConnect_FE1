import http from "@/lib/http";
import {
  CreateUpdateRequest,
  EditUpdateRequest,
  MyUpgradeRequestType,
  UpgradeRequestByIdResType,
  UpgradeRequestResType,
} from "@/schemaValidations/upgradeRequest";

export const updateRequestApiRequests = {
  getAllUpdateRequests: () =>
    http.get<UpgradeRequestResType>("/upgrade-requests"),
  getUpdateRequestById: (id: number) =>
    http.get<UpgradeRequestByIdResType>(`/upgrade-requests/${id}`),
  getUpdateRequests: () =>
    http.get<MyUpgradeRequestType>("/upgrade-requests/my-request"),
  createUpdateRequest: (body: CreateUpdateRequest) =>
    http.post("/upgrade-requests", body),
  editUpdateRequest: (body: EditUpdateRequest, id: number) =>
    http.patch(`/upgrade-requests/${id}/review`, body),
};
