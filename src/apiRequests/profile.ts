import http from "@/lib/http";
import {
  ProfileResType,
  UpdateProfile,
} from "@/schemaValidations/profile.schema";

const profileApiRequest = {
  getProfile: () => http.get<ProfileResType>("/users/me"),
  updateProfile: (body: UpdateProfile | FormData) => {
    if (body instanceof FormData) {
      return http.put<ProfileResType>("/users/update/me", body, {
        headers: {},
      });
    }
    return http.put<ProfileResType>("/users/update/me", body);
  },
  updatePassword: (body: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }) => http.put<ProfileResType>("/users/change-password", body),
};

export default profileApiRequest;
