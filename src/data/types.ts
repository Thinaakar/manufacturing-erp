export type UserStatus = 'active' | 'inactive';

export interface ErpUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  avatar: string;
  department?: string;
  createdAt: string;
}

export interface ErpRole {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  color: string;
  status: 'active' | 'inactive';
  isSystem?: boolean;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  permissions: string[];
  isDemo?: boolean;
}
