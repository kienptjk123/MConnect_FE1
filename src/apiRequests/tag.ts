import http from "@/lib/http";

const tagApiRequest = {
  getTags: () => http.get<any>("/tags"),
};

export default tagApiRequest;
