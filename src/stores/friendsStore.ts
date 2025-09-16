import { friendsApiRequest } from "@/apiRequests/friends";
import { UserType } from "@/schemaValidations/friends.schema";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface FriendsState {
  friends: UserType[];
  isLoading: boolean;
  selectedFriend: UserType | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  // Actions
  fetchFriends: (page?: number, limit?: number) => Promise<void>;
  setSelectedFriend: (friend: UserType | null) => void;
  clearFriends: () => void;
}

export const useFriendsStore = create<FriendsState>()(
  devtools(
    (set, get) => ({
      friends: [],
      isLoading: false,
      selectedFriend: null,
      pagination: null,

      fetchFriends: async () => {
        set({ isLoading: true });
        try {
          const response = await friendsApiRequest.getFriends();
          const { friends, pagination } = response.payload.result;
          set({
            friends,
            pagination,
            isLoading: false,
          });
        } catch (error) {
          console.error("❌ [FriendsStore] Failed to fetch friends:", {
            error,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          set({ friends: [], isLoading: false });
        }
      },

      setSelectedFriend: (friend: UserType | null) => {
        set({ selectedFriend: friend });
      },

      clearFriends: () => {
        set({
          friends: [],
          selectedFriend: null,
          pagination: null,
          isLoading: false,
        });
      },
    }),
    {
      name: "friends-store",
    }
  )
);

export const useFriends = () => useFriendsStore((state) => state.friends);
export const useFriendsLoading = () =>
  useFriendsStore((state) => state.isLoading);
export const useSelectedFriend = () =>
  useFriendsStore((state) => state.selectedFriend);

export const useFetchFriends = () =>
  useFriendsStore((state) => state.fetchFriends);
export const useSetSelectedFriend = () =>
  useFriendsStore((state) => state.setSelectedFriend);
export const useClearFriends = () =>
  useFriendsStore((state) => state.clearFriends);
