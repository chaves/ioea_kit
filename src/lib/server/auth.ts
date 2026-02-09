import { prisma } from './db';
import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'ioea_session';
const SESSION_EXPIRY_HOURS = 24;

// Fallback only: if the DB isn't migrated/available, sessions will still work
// for a single Node process (but won't survive restarts or scale horizontally).
const memorySessions = new Map<string, Session>();
let warnedDbSessionsUnavailable = false;

// Session data structure
export interface Session {
	userId: number;
	email: string;
	name: string;
	roles: string[]; // Array of role names
	expiresAt: Date;
	// Legacy fields for backward compatibility during migration
	userType?: 'admin' | 'reviewer' | 'student' | 'program-admin';
	reviewerGroup?: number;
	reviewerType?: string;
}

// Generate a random session ID
function generateSessionId(): string {
	// Use crypto-grade randomness; Math.random() is predictable.
	return generateSecureToken();
}

async function getUserWithRolesById(userId: number) {
	const user = await prisma.users.findUnique({
		where: { id: userId },
		include: {
			roles: {
				include: {
					role: true
				}
			}
		}
	});

	if (!user) return null;

	return {
		...user,
		roleNames: user.roles.map((ur) => ur.role.name)
	};
}

// Create a session
export async function createSession(
	cookies: Cookies,
	userData: {
		userId: number;
		email: string;
		name: string;
		roles: string[];
		reviewerGroup?: number;
		reviewerType?: string;
	}
): Promise<string> {
	const sessionId = generateSessionId();
	const sessionHash = hashToken(sessionId);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

	try {
		await prisma.sessions.create({
			data: {
				token_hash: sessionHash,
				user_id: userData.userId,
				expires_at: expiresAt
			}
		});
	} catch (err) {
		if (!warnedDbSessionsUnavailable) {
			warnedDbSessionsUnavailable = true;
			console.warn('DB session storage unavailable; falling back to in-memory sessions.', err);
		}

		// Determine legacy userType for backward compatibility
		let userType: 'admin' | 'reviewer' | 'student' | 'program-admin' | undefined;
		if (userData.roles.includes('admin')) {
			userType = 'admin';
		} else if (userData.roles.includes('reviewer')) {
			userType = 'reviewer';
		} else if (userData.roles.includes('student')) {
			userType = 'student';
		} else if (userData.roles.includes('program-admin')) {
			userType = 'program-admin';
		}

		const session: Session = {
			userId: userData.userId,
			email: userData.email,
			name: userData.name,
			roles: userData.roles,
			expiresAt,
			userType,
			reviewerGroup: userData.reviewerGroup,
			reviewerType: userData.reviewerType
		};

		memorySessions.set(sessionId, session);
	}

	cookies.set(SESSION_COOKIE_NAME, sessionId, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: SESSION_EXPIRY_HOURS * 60 * 60
	});

	return sessionId;
}

// Get session from cookies
export async function getSession(cookies: Cookies): Promise<Session | null> {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (!sessionId) return null;

	// Fast path for fallback sessions.
	const memorySession = memorySessions.get(sessionId);
	if (memorySession) {
		if (memorySession.expiresAt < new Date()) {
			memorySessions.delete(sessionId);
			cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
			return null;
		}
		return memorySession;
	}

	const sessionHash = hashToken(sessionId);
	let record: { user_id: number; expires_at: Date } | null = null;
	try {
		record = await prisma.sessions.findUnique({
			where: { token_hash: sessionHash },
			select: { user_id: true, expires_at: true }
		});
	} catch (err) {
		if (!warnedDbSessionsUnavailable) {
			warnedDbSessionsUnavailable = true;
			console.warn('DB session lookup failed; users may be logged out until DB is migrated.', err);
		}
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	// Check if expired
	if (!record || record.expires_at < new Date()) {
		if (record) {
			await prisma.sessions.delete({ where: { token_hash: sessionHash } }).catch(() => {});
		}
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	const user = await getUserWithRolesById(record.user_id);
	if (!user || !user.active) {
		await prisma.sessions.delete({ where: { token_hash: sessionHash } }).catch(() => {});
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	// Determine legacy userType for backward compatibility
	let userType: 'admin' | 'reviewer' | 'student' | 'program-admin' | undefined;
	if (user.roleNames.includes('admin')) {
		userType = 'admin';
	} else if (user.roleNames.includes('reviewer')) {
		userType = 'reviewer';
	} else if (user.roleNames.includes('student')) {
		userType = 'student';
	} else if (user.roleNames.includes('program-admin')) {
		userType = 'program-admin';
	}

	// Determine reviewer type from roles
	let reviewerType: string | undefined;
	if (user.roleNames.includes('admin')) {
		reviewerType = 'manager';
	} else if (user.roleNames.includes('reviewer')) {
		reviewerType = 'reviewer';
	}

	return {
		userId: user.id,
		email: user.email,
		name: user.name,
		roles: user.roleNames,
		expiresAt: record.expires_at,
		userType,
		reviewerGroup: user.legacy_reviewer_group ?? undefined,
		reviewerType
	};
}

// Destroy session
export async function destroySession(cookies: Cookies): Promise<void> {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (sessionId) {
		memorySessions.delete(sessionId);
		const sessionHash = hashToken(sessionId);
		await prisma.sessions.delete({ where: { token_hash: sessionHash } }).catch(() => {});
	}
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

// Get user with roles by email
export async function getUserByEmail(email: string) {
	const user = await prisma.users.findUnique({
		where: { email },
		include: {
			roles: {
				include: {
					role: true,
				},
			},
		},
	});

	if (!user) return null;

	return {
		...user,
		roleNames: user.roles.map((ur) => ur.role.name),
	};
}

// Validate user credentials (email + password)
export async function validateUserCredentials(
	email: string,
	password: string
): Promise<{
	userId: number;
	name: string;
	email: string;
	roles: string[];
	reviewerGroup?: number;
	reviewerType?: string;
} | null> {
	const user = await getUserByEmail(email);

	if (!user || !user.active) return null;

	// If no password hash, user can't login with password
	if (!user.password_hash) return null;

	// Verify password
	const isValid = await verifyPassword(password, user.password_hash);
	if (!isValid) return null;

	// Get legacy reviewer group if exists
	let reviewerGroup: number | undefined;
	if (user.legacy_reviewer_group) {
		reviewerGroup = user.legacy_reviewer_group;
	}

	// Determine reviewer type from roles
	let reviewerType: string | undefined;
	if (user.roleNames.includes('admin')) {
		reviewerType = 'manager';
	} else if (user.roleNames.includes('reviewer')) {
		reviewerType = 'reviewer';
	}

	return {
		userId: user.id,
		name: user.name,
		email: user.email,
		roles: user.roleNames,
		reviewerGroup,
		reviewerType,
	};
}

// Validate user by email only (for students without passwords)
export async function validateUserByEmail(
	email: string
): Promise<{
	userId: number;
	name: string;
	email: string;
	roles: string[];
} | null> {
	const user = await getUserByEmail(email);

	if (!user || !user.active) return null;

	return {
		userId: user.id,
		name: user.name,
		email: user.email,
		roles: user.roleNames,
	};
}

// --- Token & Password utilities ---

export function generateSecureToken(): string {
	return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateRandomPassword(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
	let password = '';
	const bytes = crypto.randomBytes(12);
	for (let i = 0; i < 12; i++) {
		password += chars[bytes[i] % chars.length];
	}
	return password;
}

// --- Password Reset Token functions ---

export async function createPasswordResetToken(userId: number): Promise<string> {
	// Invalidate old unused tokens for this user
	await prisma.password_reset_tokens.updateMany({
		where: { user_id: userId, used_at: null },
		data: { used_at: new Date() },
	});

	const rawToken = generateSecureToken();
	const tokenHash = hashToken(rawToken);
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

	await prisma.password_reset_tokens.create({
		data: {
			user_id: userId,
			token_hash: tokenHash,
			expires_at: expiresAt,
		},
	});

	return rawToken;
}

export async function validateResetToken(rawToken: string): Promise<number | null> {
	const tokenHash = hashToken(rawToken);

	const record = await prisma.password_reset_tokens.findUnique({
		where: { token_hash: tokenHash },
	});

	if (!record) return null;
	if (record.used_at) return null;
	if (record.expires_at < new Date()) return null;

	return record.user_id;
}

export async function consumeResetToken(rawToken: string): Promise<void> {
	const tokenHash = hashToken(rawToken);

	await prisma.password_reset_tokens.update({
		where: { token_hash: tokenHash },
		data: { used_at: new Date() },
	});
}

// --- User CRUD functions ---

export async function createUser({
	email,
	name,
	password,
	roleNames,
	grantedBy,
}: {
	email: string;
	name: string;
	password: string;
	roleNames: string[];
	grantedBy?: number;
}) {
	const passwordHash = await hashPassword(password);

	const user = await prisma.users.create({
		data: {
			email,
			name,
			password_hash: passwordHash,
			must_change_password: true,
		},
	});

	// Assign roles
	if (roleNames.length > 0) {
		const roles = await prisma.roles.findMany({
			where: { name: { in: roleNames } },
		});

		await prisma.user_roles.createMany({
			data: roles.map((role) => ({
				user_id: user.id,
				role_id: role.id,
				granted_by: grantedBy ?? null,
			})),
		});
	}

	return user;
}

export async function updateUser(
	userId: number,
	data: {
		name?: string;
		email?: string;
		active?: boolean;
		roleNames?: string[];
	}
) {
	// Update user fields
	const updateData: Record<string, unknown> = {};
	if (data.name !== undefined) updateData.name = data.name;
	if (data.email !== undefined) updateData.email = data.email;
	if (data.active !== undefined) updateData.active = data.active;

	if (Object.keys(updateData).length > 0) {
		await prisma.users.update({
			where: { id: userId },
			data: updateData,
		});
	}

	// Update roles if provided
	if (data.roleNames !== undefined) {
		// Remove existing roles
		await prisma.user_roles.deleteMany({
			where: { user_id: userId },
		});

		// Assign new roles
		if (data.roleNames.length > 0) {
			const roles = await prisma.roles.findMany({
				where: { name: { in: data.roleNames } },
			});

			await prisma.user_roles.createMany({
				data: roles.map((role) => ({
					user_id: userId,
					role_id: role.id,
				})),
			});
		}
	}
}

export async function getAllUsersWithRoles() {
	const users = await prisma.users.findMany({
		include: {
			roles: {
				include: {
					role: true,
				},
			},
		},
		orderBy: { created_at: 'desc' },
	});

	return users.map((user) => ({
		id: user.id,
		email: user.email,
		name: user.name,
		active: user.active,
		must_change_password: user.must_change_password,
		created_at: user.created_at,
		roleNames: user.roles.map((ur) => ur.role.name),
	}));
}

// --- Rate limiting ---

const forgotPasswordAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkForgotPasswordRateLimit(ip: string): boolean {
	const now = Date.now();
	const windowMs = 15 * 60 * 1000; // 15 minutes
	const maxAttempts = 5;

	const record = forgotPasswordAttempts.get(ip);

	if (!record || now - record.firstAttempt > windowMs) {
		forgotPasswordAttempts.set(ip, { count: 1, firstAttempt: now });
		return true; // allowed
	}

	if (record.count >= maxAttempts) {
		return false; // rate limited
	}

	record.count++;
	return true; // allowed
}

// Validate program admin password
export async function validateProgramAdminPassword(password: string): Promise<boolean> {
	const adminPassword = process.env.PROGRAM_ADMIN_PASSWORD;
	if (!adminPassword) {
		console.error('PROGRAM_ADMIN_PASSWORD not set in environment');
		return false;
	}
	return password === adminPassword;
}

// Role checking helpers
export function hasRole(session: Session | null, role: string): boolean {
	if (!session) return false;
	return session.roles.includes(role);
}

export function hasAnyRole(session: Session | null, roles: string[]): boolean {
	if (!session) return false;
	return roles.some((role) => session.roles.includes(role));
}

export function hasAllRoles(session: Session | null, roles: string[]): boolean {
	if (!session) return false;
	return roles.every((role) => session.roles.includes(role));
}

// Legacy functions for backward compatibility during migration
export async function validateAdminCredentials(
	email: string,
	password: string
): Promise<{
	userId: number;
	name: string;
	reviewerType: string;
	reviewerGroup: number | null;
} | null> {
	// Use new system only - legacy call_reviewers auth removed
	const user = await validateUserCredentials(email, password);
	if (user) {
		return {
			userId: user.userId,
			name: user.name,
			reviewerType: user.reviewerType || 'reviewer',
			reviewerGroup: user.reviewerGroup ?? null,
		};
	}

	return null;
}

export async function validateStudentCredentials(
	email: string,
	password: string
): Promise<{
	userId: number;
	name: string;
} | null> {
	// Try new system first (email-only for students)
	const user = await validateUserByEmail(email);
	if (user && user.roles.includes('student')) {
		// Students don't need password - just email verification
		return {
			userId: user.userId,
			name: user.name,
		};
	}

	// Fallback to legacy students table
	const student = await prisma.students.findFirst({
		where: { email },
	});

	if (!student) return null;

	// For students, we use email-only authentication
	return {
		userId: student.id,
		name: `${student.first_name} ${student.last_name}`,
	};
}
