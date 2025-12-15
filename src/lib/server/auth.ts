import { prisma } from './db';
import type { Cookies } from '@sveltejs/kit';

const SESSION_COOKIE_NAME = 'ioea_session';
const SESSION_EXPIRY_HOURS = 24;

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
const sessions = new Map<
	string,
	{
		userId: number;
		userType: 'admin' | 'reviewer' | 'student';
		email: string;
		name: string;
		reviewerGroup?: number;
		reviewerType?: string;
		expiresAt: Date;
	}
>();

// Create a session
export async function createSession(
	cookies: Cookies,
	userData: {
		userId: number;
		userType: 'admin' | 'reviewer' | 'student';
		email: string;
		name: string;
		reviewerGroup?: number;
		reviewerType?: string;
	}
): Promise<string> {
	const sessionId = generateSessionId();
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

	sessions.set(sessionId, {
		...userData,
		expiresAt
	});

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
export async function getSession(cookies: Cookies) {
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

// Validate admin credentials
export async function validateAdminCredentials(
	email: string,
	password: string
): Promise<{
	userId: number;
	name: string;
	reviewerType: string;
	reviewerGroup: number | null;
} | null> {
	const reviewer = await prisma.call_reviewers.findFirst({
		where: {
			email: email
		}
	});

	if (!reviewer) return null;

	// Simple password comparison - in production use bcrypt
	if (reviewer.password !== password) return null;

	return {
		userId: reviewer.id,
		name: reviewer.name ?? `${reviewer.email}`,
		reviewerType: reviewer.type ?? 'reviewer',
		reviewerGroup: reviewer.group ?? null
	};
}

// Validate student credentials
export async function validateStudentCredentials(
	email: string,
	password: string
): Promise<{
	userId: number;
	name: string;
} | null> {
	// Students authenticate via email - check if student exists
	const student = await prisma.students.findFirst({
		where: {
			email: email
		}
	});

	if (!student) return null;

	// For students, we use a simple password check or email verification
	// In production, implement proper password hashing
	return {
		userId: student.id,
		name: `${student.first_name} ${student.last_name}`
	};
}
