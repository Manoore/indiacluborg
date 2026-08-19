export type ParticipationType = "walking" | "pledging" | "both";

export type PaymentStatus = "pledged" | "paid" | "declined" | "cancelled" | "unknown";

export type DisplayNameMode = "first" | "full" | "anonymous";

export interface Community {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  displayOrder: number;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  displayNameMode: DisplayNameMode;
  email: string;
  phone?: string;
  participationType: ParticipationType;
  communityId: string;
  pledgeAmount: number;
  dedication?: string;
  heartVisible: boolean;
  approved: boolean;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  title: string;
  date: string;
  teamName: string;
  tagline: string;
  registrationOpen: boolean;
  donationUrl?: string;
}

export interface CommunityStats {
  communityId: string;
  communityName: string;
  hearts: number;
  walkers: number;
  pledged: number;
}
