import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserProfile } from "@/schemaValidations/profile.schema";
import profileApiRequest from "@/apiRequests/profile";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        isLoading: false,

        fetchProfile: async () => {
          set({ isLoading: true });

          try {
            console.log("🔄 [ProfileStore] Starting profile fetch...");
            const response = await profileApiRequest.getProfile();

            console.log("📡 [ProfileStore] API Response:", {
              status: response.status,
              payload: response.payload,
              result: response.payload?.result,
            });

            const profileData = response.payload.result;

            if (!profileData) {
              set({ profile: null, isLoading: false });
              return;
            }

            set({ profile: profileData, isLoading: false });
          } catch (error) {
            console.error("❌ [ProfileStore] Failed to fetch profile:", {
              error,
              message: error instanceof Error ? error.message : "Unknown error",
              status:
                error instanceof Error && "status" in error
                  ? (error as any).status
                  : "No status",
            });

            set({ profile: null, isLoading: false });
          }
        },

        setProfile: (profile: UserProfile | null) => {
          console.log("📝 [ProfileStore] Setting profile:", profile);
          set({ profile });
        },

        clearProfile: () => {
          console.log("🗑️ [ProfileStore] Clearing profile");
          set({ profile: null, isLoading: false });
        },
      }),
      {
        name: "profile-storage", // tên key trong localStorage
      }
    ),
    { name: "profile-store-devtools" } // name cho devtools
  )
);

// Simple selectors
export const useProfile = () => useProfileStore((state) => state.profile);
export const useProfileLoading = () =>
  useProfileStore((state) => state.isLoading);
export const useFetchProfile = () =>
  useProfileStore((state) => state.fetchProfile);
export const useSetProfile = () => useProfileStore((state) => state.setProfile);
export const useClearProfile = () =>
  useProfileStore((state) => state.clearProfile);
