import { apiJson } from '@/lib/http/client';
import type { ErpRole, ErpUser } from '@/data/types';

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar: string;
  department?: string;
  createdAt?: string;
};

type ApiRole = {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  color: string;
  status: 'active' | 'inactive';
  isSystem?: boolean;
};

export function mapApiUser(u: ApiUser): ErpUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    avatar: u.avatar,
    department: u.department,
    createdAt: u.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  };
}

export function mapApiRole(r: ApiRole): ErpRole {
  return {
    id: r.id,
    name: r.name,
    label: r.label,
    description: r.description,
    permissions: r.permissions,
    color: r.color,
    status: r.status,
    isSystem: r.isSystem,
  };
}

export async function fetchUsersApi(): Promise<ErpUser[]> {
  const rows = await apiJson<ApiUser[]>('/api/users');
  return rows.map(mapApiUser);
}

export async function createUserApi(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  status?: 'active' | 'inactive';
  department?: string;
  avatar?: string;
}): Promise<ErpUser> {
  const created = await apiJson<ApiUser>('/api/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapApiUser(created);
}

export async function updateUserApi(
  id: string,
  patch: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    status: 'active' | 'inactive';
    department: string;
    avatar: string;
  }>,
): Promise<ErpUser> {
  const updated = await apiJson<ApiUser>(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return mapApiUser(updated);
}

export async function deleteUserApi(id: string): Promise<void> {
  await apiJson<{ deleted: boolean }>(`/api/users/${id}`, { method: 'DELETE' });
}

export async function fetchRolesApi(): Promise<ErpRole[]> {
  const rows = await apiJson<ApiRole[]>('/api/roles');
  return rows.map(mapApiRole);
}

export async function createRoleApi(input: {
  name: string;
  label: string;
  description: string;
  permissions?: string[];
  color?: string;
  status?: 'active' | 'inactive';
  isSystem?: boolean;
}): Promise<ErpRole> {
  const created = await apiJson<ApiRole>('/api/roles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapApiRole(created);
}

export async function updateRoleApi(
  id: string,
  patch: Partial<{
    name: string;
    label: string;
    description: string;
    permissions: string[];
    color: string;
    status: 'active' | 'inactive';
  }>,
): Promise<ErpRole> {
  const updated = await apiJson<ApiRole>(`/api/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return mapApiRole(updated);
}

export async function deleteRoleApi(id: string): Promise<void> {
  await apiJson<{ deleted: boolean }>(`/api/roles/${id}`, { method: 'DELETE' });
}
