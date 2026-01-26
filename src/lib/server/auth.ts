import { prisma } from './db';
import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

const SESSION_COOKIE_NAME = 'ioea_session';
const SESSION_EXPIRY_HOURS = 24;

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
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 64; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Session data stored in memory (for simplicity - in production use database)
const sessions = new Map<string, Session>();

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
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

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
		reviewerType: userData.reviewerType,
	};

	sessions.set(sessionId, session);

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

	const session = sessions.get(sessionId);
	if (!session) return null;

	// Check if expired
	if (session.expiresAt < new Date()) {
		sessions.delete(sessionId);
		cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		return null;
	}

	return session;
}

// Destroy session
export async function destroySession(cookies: Cookies): Promise<void> {
	const sessionId = cookies.get(SESSION_COOKIE_NAME);
	if (sessionId) {
		sessions.delete(sessionId);
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
	// Try new system first
	const user = await validateUserCredentials(email, password);
	if (user) {
		return {
			userId: user.userId,
			name: user.name,
			reviewerType: user.reviewerType || 'reviewer',
			reviewerGroup: user.reviewerGroup ?? null,
		};
	}

	// Fallback to legacy call_reviewers table
	const reviewer = await prisma.call_reviewers.findFirst({
		where: { email },
	});

	if (!reviewer) return null;

	// Simple password comparison (legacy - not hashed)
	if (reviewer.password !== password) return null;

	return {
		userId: reviewer.id,
		name: reviewer.name ?? `${reviewer.email}`,
		reviewerType: reviewer.type ?? 'reviewer',
		reviewerGroup: reviewer.group ?? null,
	};
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
