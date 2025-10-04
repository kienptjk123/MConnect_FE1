import http from "@/lib/http";
import {
  LabelCreateResponseType,
  LabelUpdateResponseType,
  LabelsResponseType,
  LabelDeleteResponseType,
  LabelCreateType,
  LabelUpdateType,
} from "@/schemaValidations/label.schema";

const labelsApiRequest = {
  // GET /labels
  getAllLabels: () => {
    return http.get<LabelsResponseType>("/labels");
  },

  // GET /labels/:id
  getLabelById: (id: number) => {
    return http.get<LabelCreateResponseType>(`/labels/${id}`);
  },

  // POST /labels/create
  createLabel: (body: LabelCreateType) => {
    return http.post<LabelCreateResponseType>("/labels/create", body);
  },

  // PUT /labels/:id
  updateLabel: (id: number, body: LabelUpdateType) => {
    return http.put<LabelUpdateResponseType>(`/labels/update/${id}`, body);
  },

  // DELETE /labels/delete/:id
  deleteLabel: (id: number) => {
    return http.delete<LabelDeleteResponseType>(`/labels/delete/${id}`);
  },
};

export default labelsApiRequest;
