/** Firestore record types returned by app-data / app-writes. */

export type RecordStatus = 'active' | 'inactive';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettingsRecord extends Timestamps {
  id: string;
  companyName: string;
  primaryPlantId: string;
  fiscalYearStart: string;
  currency: string;
  timeZone: string;
  shiftModel: string;
}

export interface UserRecord extends Timestamps {
  id: string;
  name: string;
  email: string;
  role: string;
  status: RecordStatus;
  avatar: string;
  department?: string;
  passwordHash: string;
}

export interface PublicUser extends Omit<UserRecord, 'passwordHash'> {}

export interface RoleRecord extends Timestamps {
  id: string;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  color: string;
  status: RecordStatus;
  isSystem?: boolean;
}

export interface AppAssetRecord extends Timestamps {
  id: string;
  url: string;
  contentType?: string;
  path?: string;
}

export type MasterRecord = Record<string, unknown> & { id: string; status?: RecordStatus };
