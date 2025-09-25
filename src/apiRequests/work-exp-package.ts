import http from "@/lib/http";
import {
  WorkExperiencePackageCreateInput,
  WorkExperiencePackageRes,
  WorkExperiencePackageUpdateInput,
} from "@/schemaValidations/work-exp-package.schema";

const workExpPackageApiRequest = {
  getWorkExpPackages: () =>
    http.get<WorkExperiencePackageRes>("/work-experience-booking/packages"),
  getWorkExpPackageById: (id: number) =>
    http.get<{ data: any }>(`/work-experience-booking/packages/${id}`),
  createWorkExpPackage: (data: WorkExperiencePackageCreateInput) =>
    http.post("/work-experience-booking/packages", data),
  updateWorkExpPackage: (id: number, data: WorkExperiencePackageUpdateInput) =>
    http.put(`/work-experience-booking/packages/${id}`, data),
  deleteWorkExpPackage: (id: number) =>
    http.delete(`/work-experience-booking/packages/${id}`),
};

export default workExpPackageApiRequest;
