import http from "@/lib/http";
import { ProfileResType } from "@/schemaValidations/profile.schema";

const profileApiRequest = {
  getProfile: () => http.get<ProfileResType>("/users/me"),
};

export default profileApiRequest;
