import http from "@/lib/http";

export interface MentorCard {
  id: number;
  mentorProfileId: number;
  accountNumber: string;
  bankName: string;
  cardHolderName: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMentorCardRequest {
  account_number: string;
  bank_name: string;
  card_holder_name: string;
  is_default?: boolean;
}

export interface UpdateMentorCardRequest {
  account_number?: string;
  bank_name?: string;
  card_holder_name?: string;
  is_default?: boolean;
}

export interface GetMentorCardsResponse {
  message: string;
  result: {
    cards: MentorCard[];
  };
}

export interface MentorCardResponse {
  message: string;
  result: MentorCard;
}

const mentorCardApiRequest = {
  // Get mentor's cards
  getMentorCards: () => http.get<GetMentorCardsResponse>("/mentor-cards"),

  // Create new mentor card
  createMentorCard: (body: CreateMentorCardRequest) =>
    http.post<MentorCardResponse>("/mentor-cards", body),

  // Update mentor card
  updateMentorCard: (id: number, body: UpdateMentorCardRequest) =>
    http.put<MentorCardResponse>(`/mentor-cards/${id}`, body),

  // Delete mentor card
  deleteMentorCard: (id: number) =>
    http.delete<{ message: string }>(`/mentor-cards/${id}`),

  // Set card as default
  setDefaultCard: (id: number) =>
    http.patch<MentorCardResponse>(`/mentor-cards/${id}/default`, {}),

  // Get default card
  getDefaultCard: () => http.get<MentorCardResponse>("/mentor-cards/default"),
};

export default mentorCardApiRequest;
