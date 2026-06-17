import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const recordStatusSchema = z.enum(['active', 'inactive']);

export const userCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(1),
  status: recordStatusSchema.default('active'),
  department: z.string().optional(),
  avatar: z.string().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().min(1).optional(),
  status: recordStatusSchema.optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
});

export const roleCreateSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  permissions: z.array(z.string()).default([]),
  color: z.string().default('default'),
  status: recordStatusSchema.default('active'),
  isSystem: z.boolean().optional(),
});

export const roleUpdateSchema = roleCreateSchema.partial();

export const companySettingsSchema = z.object({
  companyName: z.string().min(1),
  primaryPlantId: z.string().min(1),
  fiscalYearStart: z.string().min(1),
  currency: z.string().min(1),
  timeZone: z.string().min(1),
  shiftModel: z.string().min(1),
});

export const masterRecordCreateSchema = z.record(z.string(), z.unknown());

export const masterRecordUpdateSchema = z.record(z.string(), z.unknown());
