export interface UserProfile {
  id: number;
  name: string;
  identifier: string;
  role: string;
  is_active: boolean;
}

export interface ProfileUpdatePayload {
  name: string;
  password?: string;
  confirm_password?: string;
}
