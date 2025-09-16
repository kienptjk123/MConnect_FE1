import http from "@/lib/http";
import {
  CreateUpdateRequest,
  EditUpdateRequest,
  UpgradeRequestByIdResType,
  UpgradeRequestResType,
} from "@/schemaValidations/upgradeRequest";

export const updateRequestApiRequests = {
  getAllUpdateRequests: () =>
    http.get<UpgradeRequestResType>("/upgrade-requests"),
  getUpdateRequestById: (id: number) =>
    http.get<UpgradeRequestByIdResType>(`/upgrade-requests/${id}`),
  getUpdateRequests: () =>
    http.get<UpgradeRequestResType>("/upgrade-requests/my-requests"),
  createUpdateRequest: (body: CreateUpdateRequest) =>
    http.post("/update-requests/create", body),
  editUpdateRequest: (body: EditUpdateRequest, id: number) =>
    http.patch(`/upgrade-requests/${id}`, body),
};
