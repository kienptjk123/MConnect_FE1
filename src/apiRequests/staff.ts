import http from "@/lib/http";
import {
  StaffResponseType,
  UpdateStaffProfileType,
} from "@/schemaValidations/staff.schema";

const staffApiRequest = {
  getAllStaff: () => {
    return http.get<StaffResponseType>("/users/staff/all");
  },
  getStaffById: (id: number) => {
    return http.get<StaffResponseType>(`/users/staff/${id}`);
  },
  registerStaff: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
  }) => {
    return http.post("/users/staff/register", data);
  },
  updateStaff: (id: number, data: UpdateStaffProfileType) => {
    return http.put(`/users/staff/update/${id}`, data);
  },
  deleteStaff: (id: number) => {
    return http.delete(`/users/delete/${id}`);
  },
};

export default staffApiRequest;
