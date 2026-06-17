export interface Membership {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  points: number;
  joined_at: string;
}

export interface MembershipLog {
  id: string;
  action: string;
  points_change: number;
  created_at: string;
  description: string;
}
