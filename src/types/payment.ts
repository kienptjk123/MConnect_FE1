export interface PaymentType {
  id: number;
  providerRef?: string;
  paymentType: "BOOKING" | "COURSE";
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  singleSessionBooking?: {
    id: number;
    menteeProfile: {
      id: number;
      name?: string;
      avatar?: string;
      phoneNumber?: string;
      user: {
        id: number;
        email: string;
      };
    };
    mentorProfile: {
      id: number;
      name?: string;
      user: {
        id: number;
        email: string;
      };
    };
  };
  workExperienceBooking?: {
    id: number;
    menteeProfile: {
      id: number;
      name?: string;
      avatar?: string;
      phoneNumber?: string;
      user: {
        id: number;
        email: string;
      };
    };
    workExperiencePackage: {
      id: number;
      title: string;
      mentorProfile: {
        id: number;
        name?: string;
        user: {
          id: number;
          email: string;
        };
      };
    };
  };
  course?: {
    id: number;
    title: string;
    price: number;
  };
  menteeProfile?: {
    id: number;
    name?: string;
    avatar?: string;
    phoneNumber?: string;
    user: {
      id: number;
      email: string;
    };
  };
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentType?: string;
  fromDate?: string;
  toDate?: string;
}
