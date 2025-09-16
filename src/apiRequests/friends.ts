import http from "@/lib/http";
import {
  SendFriendRequestBodyType,
  SendFriendRequestResType,
  AcceptFriendRequestBodyType,
  AcceptFriendRequestResType,
  FriendsListResType,
  FriendsRequestResType,
} from "@/schemaValidations/friends.schema";

export const friendsApiRequest = {
  getFriends: () => http.get<FriendsListResType>(`/friends`),
  getFriendRequests: () => http.get<FriendsRequestResType>(`/friends/requests`),

  sendFriendRequest: (body: SendFriendRequestBodyType) =>
    http.post<SendFriendRequestResType>("/friends/request", body),

  handleFriendRequest: (requestId: number, body: AcceptFriendRequestBodyType) =>
    http.put<AcceptFriendRequestResType>(`/friends/request/${requestId}`, body),
};
