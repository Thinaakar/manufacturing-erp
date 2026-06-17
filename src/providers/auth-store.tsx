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
  getRoleByName,
  MOCK_ROLES,
  MOCK_USERS,
  slugifyRoleName,
} from '@/data/mock-auth';
import type { ErpRole, ErpUser, SessionUser } from '@/data/types';
import { apiJson } from '@/lib/http/client';
import { getPermissionsForRole } from '@/lib/permissions';

const STORAGE_KEY = 'forgeos-auth';
const USERS_STORAGE_KEY = 'forgeos-users';
const CREDENTIALS_STORAGE_KEY = 'forgeos-credentials';
const PROTECTED_USER_IDS = new Set(['USR-DEMO']);

function loadStoredUsers(): ErpUser[] {
  if (typeof window === 'undefined') return MOCK_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ErpUser[]) : MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
}

function loadStoredCredentials(): Record<string, string> {
  if (typeof window === 'undefined') return { ...DEMO_CREDENTIALS };
  try {
    const raw = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    return raw ? { ...DEMO_CREDENTIALS, ...(JSON.parse(raw) as Record<string, string>) } : { ...DEMO_CREDENTIALS };
  } catch {
    return { ...DEMO_CREDENTIALS };
  }
}

function persistUsers(users: ErpUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function persistCustomCredentials(credentials: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const custom: Record<string, string> = {};
  for (const [email, password] of Object.entries(credentials)) {
    if (!(email in DEMO_CREDENTIALS)) custom[email] = password;
  }
  localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(custom));
}

function nextUserId(users: ErpUser[]): string {
  const nums = users.map((u) => {
    const match = u.id.match(/USR-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `USR-${String(next).padStart(3, '0')}`;
}

function findUserByEmail(email: string, users: ErpUser[]): ErpUser | undefined {
  const normalized = email.trim().toLowerCase();
  return (
    users.find((u) => u.email.toLowerCase() === normalized) ??
    MOCK_USERS.find((u) => u.email.toLowerCase() === normalized)
  );
}

function findUserById(id: string, users: ErpUser[]): ErpUser | undefined {
  return users.find((u) => u.id === id) ?? MOCK_USERS.find((u) => u.id === id);
}

type AuthStoreContextValue = {
  currentUser: SessionUser | null;
  users: ErpUser[];
  roles: ErpRole[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser | null>;
  demoLogin: () => Promise<SessionUser | null>;
  logout: () => void;
  addUser: (user: Omit<ErpUser, 'id' | 'createdAt'>, password: string) => void;
  updateUser: (id: string, patch: Partial<ErpUser>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Omit<ErpRole, 'id' | 'name'>) => void;
  updateRole: (id: string, patch: Partial<ErpRole>) => void;
  updateRolePermissions: (id: string, permissions: string[]) => void;
  deleteRole: (id: string) => boolean;
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

function loadPersisted() {
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
  const [credentials, setCredentials] = useState<Record<string, string>>(() => ({ ...DEMO_CREDENTIALS }));
  const [roles, setRoles] = useState<ErpRole[]>(MOCK_ROLES);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((session: SessionUser | null) => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    async function init() {
      const storedUsers = loadStoredUsers();
      const storedCredentials = loadStoredCredentials();
      setUsers(storedUsers);
      setCredentials(storedCredentials);

      try {
        const session = await apiJson<{
          id: string;
          name: string;
          email: string;
          role: string;
          avatar: string;
          permissions: string[];
        }>('/api/auth/session');

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
      } catch {
        const stored = loadPersisted();
        if (stored) {
          const match = findUserById(stored.id, storedUsers);
          if (match && match.status === 'active') {
            setCurrentUser(buildSession(match, MOCK_ROLES, stored.isDemo));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }

      setLoading(false);
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
        return apiUser;
      } catch {
        const expected = credentials[normalized];
        if (!expected || expected !== password.trim()) return null;

        const user = findUserByEmail(normalized, users);
        if (!user || user.status !== 'active') return null;

        const session = buildSession(user, roles, normalized === DEMO_SUPER_ADMIN_EMAIL);
        setCurrentUser(session);
        persistSession(session);
        return session;
      }
    },
    [users, roles, credentials, persistSession],
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
    (input: Omit<ErpUser, 'id' | 'createdAt'>, password: string) => {
      const normalizedEmail = input.email.trim().toLowerCase();
      if (!password.trim()) return;
      if (credentials[normalizedEmail]) return;

      const newUser: ErpUser = {
        ...input,
        email: normalizedEmail,
        id: nextUserId(users),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((prev) => {
        const next = [...prev, newUser];
        persistUsers(next);
        return next;
      });

      setCredentials((prev) => {
        const next = { ...prev, [normalizedEmail]: password.trim() };
        persistCustomCredentials(next);
        return next;
      });
    },
    [users, credentials],
  );

  const updateUser = useCallback((id: string, patch: Partial<ErpUser>) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, ...patch } : u));
      persistUsers(next);
      return next;
    });

    if (patch.email) {
      const existing = users.find((u) => u.id === id);
      if (existing) {
        const oldEmail = existing.email.toLowerCase();
        const newEmail = patch.email.trim().toLowerCase();
        if (oldEmail !== newEmail) {
          setCredentials((prev) => {
            const next = { ...prev };
            if (next[oldEmail]) {
              next[newEmail] = next[oldEmail];
              delete next[oldEmail];
            }
            persistCustomCredentials(next);
            return next;
          });
        }
      }
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
  }, [roles, persistSession, users]);

  const deleteUser = useCallback((id: string) => {
    if (PROTECTED_USER_IDS.has(id)) return;
    const removed = users.find((u) => u.id === id);
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== id);
      persistUsers(next);
      return next;
    });
    if (removed) {
      const email = removed.email.toLowerCase();
      setCredentials((prev) => {
        if (!(email in DEMO_CREDENTIALS)) {
          const next = { ...prev };
          delete next[email];
          persistCustomCredentials(next);
          return next;
        }
        return prev;
      });
    }
    if (currentUser?.id === id) logout();
  }, [currentUser?.id, logout, users]);

  const addRole = useCallback((input: Omit<ErpRole, 'id' | 'name'>) => {
    const name = slugifyRoleName(input.label);
    const newRole: ErpRole = {
      ...input,
      id: `role_${name}`,
      name,
      isSystem: false,
    };
    setRoles((prev) => [...prev, newRole]);
  }, []);

  const updateRole = useCallback((id: string, patch: Partial<ErpRole>) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const updateRolePermissions = useCallback((id: string, permissions: string[]) => {
    setRoles((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, permissions } : r));
      setCurrentUser((user) => {
        if (!user) return user;
        const role = next.find((r) => r.name === user.role);
        if (role?.id !== id) return user;
        const updated = { ...user, permissions };
        persistSession(updated);
        return updated;
      });
      return next;
    });
  }, [persistSession]);

  const deleteRole = useCallback((id: string): boolean => {
    const role = roles.find((r) => r.id === id);
    if (!role || role.isSystem) return false;
    if (users.some((u) => u.role === role.name)) return false;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    return true;
  }, [roles, users]);

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
      login,
      demoLogin,
      logout,
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
      login,
      demoLogin,
      logout,
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
