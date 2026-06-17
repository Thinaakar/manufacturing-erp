'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEMO_CREDENTIALS,
  DEMO_SUPER_ADMIN_EMAIL,
  DEMO_SUPER_ADMIN_PASSWORD,
  MOCK_ROLES,
  MOCK_USERS,
  slugifyRoleName,
} from '@/data/mock-auth';
import type { ErpRole, ErpUser, SessionUser } from '@/data/types';
import {
  createRoleApi,
  createUserApi,
  deleteRoleApi,
  deleteUserApi,
  fetchRolesApi,
  fetchUsersApi,
  updateRoleApi,
  updateUserApi,
} from '@/lib/auth/api-client';
import { apiJson } from '@/lib/http/client';
import { getPermissionsForRole } from '@/lib/permissions';

const STORAGE_KEY = 'forgeos-auth';
const PROTECTED_USER_IDS = new Set(['USR-DEMO']);

function findUserByEmail(email: string, users: ErpUser[]): ErpUser | undefined {
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized);
}

function findUserById(id: string, users: ErpUser[]): ErpUser | undefined {
  return users.find((u) => u.id === id);
}

type AuthStoreContextValue = {
  currentUser: SessionUser | null;
  users: ErpUser[];
  roles: ErpRole[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<SessionUser | null>;
  demoLogin: () => Promise<SessionUser | null>;
  logout: () => void;
  refreshDirectory: () => Promise<void>;
  addUser: (user: Omit<ErpUser, 'id' | 'createdAt'>, password: string) => Promise<void>;
  updateUser: (id: string, patch: Partial<ErpUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addRole: (role: Omit<ErpRole, 'id' | 'name'>) => Promise<void>;
  updateRole: (id: string, patch: Partial<ErpRole>) => Promise<void>;
  updateRolePermissions: (id: string, permissions: string[]) => Promise<void>;
  deleteRole: (id: string) => Promise<boolean>;
  countUsersByRole: (roleName: string) => number;
};

const AuthStoreContext = createContext<AuthStoreContextValue | null>(null);

function buildSession(user: ErpUser, roles: ErpRole[], isDemo = false): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    permissions: getPermissionsForRole(user.role, roles),
    isDemo,
  };
}

function loadPersisted(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<ErpUser[]>(MOCK_USERS);
  const [roles, setRoles] = useState<ErpRole[]>(MOCK_ROLES);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useApi, setUseApi] = useState(false);

  const persistSession = useCallback((session: SessionUser | null) => {
    if (typeof window === 'undefined') return;
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshDirectory = useCallback(async () => {
    if (!useApi) return;
    try {
      const [apiUsers, apiRoles] = await Promise.all([fetchUsersApi(), fetchRolesApi()]);
      setUsers(apiUsers);
      setRoles(apiRoles);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users and roles.');
    }
  }, [useApi]);

  useEffect(() => {
    async function init() {
      try {
        const session = await apiJson<{
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string;
          permissions: string[];
        }>('/api/auth/session');

        setUseApi(true);
        const apiUser: SessionUser = {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
          avatar: session.avatar,
          permissions: session.permissions,
          isDemo: session.email === DEMO_SUPER_ADMIN_EMAIL,
        };
        setCurrentUser(apiUser);
        persistSession(apiUser);

        const [apiUsers, apiRoles] = await Promise.all([fetchUsersApi(), fetchRolesApi()]);
        setUsers(apiUsers);
        setRoles(apiRoles);
      } catch {
        setUseApi(false);
        const stored = loadPersisted();
        if (stored) {
          const match = findUserById(stored.id, MOCK_USERS);
          if (match && match.status === 'active') {
            setCurrentUser(buildSession(match, MOCK_ROLES, stored.isDemo));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    void init();
  }, [persistSession]);

  const login = useCallback(
    async (email: string, password: string): Promise<SessionUser | null> => {
      const normalized = email.trim().toLowerCase();

      try {
        await apiJson('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: normalized, password }),
        });
        const session = await apiJson<{
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string;
          permissions: string[];
        }>('/api/auth/session');

        setUseApi(true);
        const apiUser: SessionUser = {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
          avatar: session.avatar,
          permissions: session.permissions,
          isDemo: normalized === DEMO_SUPER_ADMIN_EMAIL,
        };
        setCurrentUser(apiUser);
        persistSession(apiUser);

        const [apiUsers, apiRoles] = await Promise.all([fetchUsersApi(), fetchRolesApi()]);
        setUsers(apiUsers);
        setRoles(apiRoles);
        setError(null);
        return apiUser;
      } catch {
        const expected = DEMO_CREDENTIALS[normalized];
        if (!expected || expected !== password.trim()) return null;

        const user = findUserByEmail(normalized, users);
        if (!user || user.status !== 'active') return null;

        setUseApi(false);
        const session = buildSession(user, roles, normalized === DEMO_SUPER_ADMIN_EMAIL);
        setCurrentUser(session);
        persistSession(session);
        return session;
      }
    },
    [users, roles, persistSession],
  );

  const demoLogin = useCallback(async (): Promise<SessionUser | null> => {
    return login(DEMO_SUPER_ADMIN_EMAIL, DEMO_SUPER_ADMIN_PASSWORD);
  }, [login]);

  const logout = useCallback(() => {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setCurrentUser(null);
    persistSession(null);
  }, [persistSession]);

  const addUser = useCallback(
    async (input: Omit<ErpUser, 'id' | 'createdAt'>, password: string) => {
      if (!password.trim()) throw new Error('Password is required.');
      if (useApi) {
        const created = await createUserApi({
          name: input.name,
          email: input.email,
          password: password.trim(),
          role: input.role,
          status: input.status,
          department: input.department,
          avatar: input.avatar,
        });
        setUsers((prev) => [...prev, created]);
        return;
      }
      if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
        throw new Error('A user with this email already exists.');
      }
      const newUser: ErpUser = {
        ...input,
        email: input.email.trim().toLowerCase(),
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [...prev, newUser]);
    },
    [useApi, users],
  );

  const updateUser = useCallback(
    async (id: string, patch: Partial<ErpUser>) => {
      if (useApi) {
        const updated = await updateUserApi(id, patch);
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      } else {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
      }

      setCurrentUser((prev) => {
        if (!prev || prev.id !== id) return prev;
        const nextRole = patch.role ?? prev.role;
        const updated = {
          ...prev,
          ...patch,
          permissions: getPermissionsForRole(nextRole, roles),
        };
        persistSession(updated);
        return updated;
      });
    },
    [useApi, roles, persistSession],
  );

  const deleteUser = useCallback(
    async (id: string) => {
      if (PROTECTED_USER_IDS.has(id)) return;
      if (useApi) {
        await deleteUserApi(id);
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (currentUser?.id === id) logout();
    },
    [useApi, currentUser?.id, logout],
  );

  const addRole = useCallback(
    async (input: Omit<ErpRole, 'id' | 'name'>) => {
      const name = slugifyRoleName(input.label);
      if (useApi) {
        const created = await createRoleApi({ name, ...input, isSystem: false });
        setRoles((prev) => [...prev, created]);
        return;
      }
      const newRole: ErpRole = { ...input, id: `role_${name}`, name, isSystem: false };
      setRoles((prev) => [...prev, newRole]);
    },
    [useApi],
  );

  const updateRole = useCallback(
    async (id: string, patch: Partial<ErpRole>) => {
      if (useApi) {
        const updated = await updateRoleApi(id, patch);
        setRoles((prev) => prev.map((r) => (r.id === id ? updated : r)));
      } else {
        setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      }
    },
    [useApi],
  );

  const updateRolePermissions = useCallback(
    async (id: string, permissions: string[]) => {
      if (useApi) {
        const updated = await updateRoleApi(id, { permissions });
        setRoles((prev) => prev.map((r) => (r.id === id ? updated : r)));
      } else {
        setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, permissions } : r)));
      }

      setCurrentUser((user) => {
        if (!user) return user;
        const role = roles.find((r) => r.id === id);
        if (role?.name !== user.role) return user;
        const updated = { ...user, permissions };
        persistSession(updated);
        return updated;
      });
    },
    [useApi, roles, persistSession],
  );

  const deleteRole = useCallback(
    async (id: string): Promise<boolean> => {
      const role = roles.find((r) => r.id === id);
      if (!role || role.isSystem) return false;
      if (users.some((u) => u.role === role.name)) return false;
      if (useApi) {
        await deleteRoleApi(id);
      }
      setRoles((prev) => prev.filter((r) => r.id !== id));
      return true;
    },
    [useApi, roles, users],
  );

  const countUsersByRole = useCallback(
    (roleName: string) => users.filter((u) => u.role === roleName).length,
    [users],
  );

  const value = useMemo(
    () => ({
      currentUser,
      users,
      roles: roles.filter((r) => r.status === 'active'),
      isAuthenticated: !!currentUser,
      loading,
      error,
      login,
      demoLogin,
      logout,
      refreshDirectory,
      addUser,
      updateUser,
      deleteUser,
      addRole,
      updateRole,
      updateRolePermissions,
      deleteRole,
      countUsersByRole,
    }),
    [
      currentUser,
      users,
      roles,
      loading,
      error,
      login,
      demoLogin,
      logout,
      refreshDirectory,
      addUser,
      updateUser,
      deleteUser,
      addRole,
      updateRole,
      updateRolePermissions,
      deleteRole,
      countUsersByRole,
    ],
  );

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthStoreContext);
  if (!ctx) throw new Error('useAuthStore must be used within AuthStoreProvider');
  return ctx;
}
