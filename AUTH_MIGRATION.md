# Authentication System Migration Guide

This document explains the new role-based authentication system and how to migrate from the old system.

## Overview

The new system implements a **role-based authentication** where:
- Users can have **multiple roles** (many-to-many relationship)
- Passwords are **hashed using bcrypt**
- Sessions store an array of roles instead of a single `userType`
- Backward compatibility is maintained during migration

## Database Schema

### New Tables

1. **`users`** - Unified user table
   - `id` - Primary key
   - `email` - Unique email address
   - `password_hash` - Bcrypt hashed password (nullable for email-only auth)
   - `name` - User's display name
   - `active` - Whether the user account is active
   - Legacy fields: `legacy_reviewer_id`, `legacy_student_id`, `legacy_reviewer_group`

2. **`roles`** - Available roles
   - `id` - Primary key
   - `name` - Role name (e.g., 'admin', 'reviewer', 'student', 'program-admin')
   - `description` - Role description

3. **`user_roles`** - Many-to-many relationship
   - `user_id` - Foreign key to users
   - `role_id` - Foreign key to roles
   - `granted_at` - When the role was granted
   - `granted_by` - Who granted the role (optional)

### Legacy Tables (Kept for Backward Compatibility)

- `call_reviewers` - Still exists, will be phased out
- `students` - Still exists, data migrated to users

## Migration Steps

### 1. Install Dependencies

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 2. Run Prisma Migration

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create migration (if using migrations)
npx prisma migrate dev --name add_user_roles_system

# Or push schema directly (for development)
npx prisma db push
```

### 3. Run Data Migration

```bash
# Migrate existing reviewers and students to users table
npx tsx scripts/migrate-to-user-roles.ts
```

This script will:
- Create the 4 default roles (admin, reviewer, student, program-admin)
- Migrate all `call_reviewers` to `users` table
- Migrate all `students` to `users` table
- Assign appropriate roles to each user

### 4. Hash Existing Passwords

```bash
# Hash all reviewer passwords
npx tsx scripts/hash-reviewer-passwords.ts
```

This script will:
- Find all reviewers with plain text passwords
- Hash them using bcrypt
- Update the `users.password_hash` field

### 5. Test the System

1. Try logging in as an admin/reviewer
2. Try logging in as a student (email-only)
3. Verify role-based access control works

## Role System

### Available Roles

- **`admin`** - Full administrative access (managers)
- **`reviewer`** - Can review applications
- **`student`** - Student participants
- **`program-admin`** - Program administration

### Multiple Roles

Users can have multiple roles. For example:
- A user could be both `reviewer` and `student`
- Check roles using helper functions: `hasRole()`, `hasAnyRole()`, `hasAllRoles()`

## Code Changes

### Authentication Functions

**Old:**
```typescript
validateAdminCredentials(email, password)
validateStudentCredentials(email, password)
```

**New:**
```typescript
validateUserCredentials(email, password)  // For password-based auth
validateUserByEmail(email)                // For email-only auth (students)
```

### Session Structure

**Old:**
```typescript
{
  userId: number;
  userType: 'admin' | 'reviewer' | 'student' | 'program-admin';
  email: string;
  name: string;
}
```

**New:**
```typescript
{
  userId: number;
  email: string;
  name: string;
  roles: string[];  // Array of role names
  // Legacy fields still present for backward compatibility
  userType?: 'admin' | 'reviewer' | 'student' | 'program-admin';
}
```

### Role Checking

**Old:**
```typescript
if (session.userType === 'admin') { ... }
```

**New:**
```typescript
import { hasRole, hasAnyRole } from '$lib/server/auth';

if (hasRole(session, 'admin')) { ... }
if (hasAnyRole(session, ['admin', 'reviewer'])) { ... }
```

## Backward Compatibility

The system maintains backward compatibility:

1. **Legacy functions still work** - `validateAdminCredentials()` and `validateStudentCredentials()` still exist and fall back to old tables if new system fails
2. **Legacy session fields** - `userType` is still populated for compatibility
3. **Legacy tables** - `call_reviewers` and `students` tables are kept during migration

## Security Improvements

1. **Password Hashing** - All passwords are now hashed using bcrypt (10 rounds)
2. **Role-Based Access** - More granular permission system
3. **Active Flag** - Users can be deactivated without deletion
4. **Audit Trail** - `granted_at` and `granted_by` fields track role assignments

## Future Enhancements

1. **Session Storage** - Move from in-memory to database/Redis
2. **Password Reset** - Implement password reset functionality
3. **Role Management UI** - Admin interface to manage user roles
4. **Permission System** - Fine-grained permissions beyond roles

## Troubleshooting

### "Role not found" error
- Run the migration script: `npx tsx scripts/migrate-to-user-roles.ts`

### "Invalid credentials" after migration
- Run the password hashing script: `npx tsx scripts/hash-reviewer-passwords.ts`
- Verify passwords were hashed correctly

### Users can't login
- Check if user exists in `users` table
- Verify user has appropriate roles in `user_roles` table
- Check if `active` flag is `true`

## Support

For issues or questions, check:
- Prisma schema: `prisma/schema.prisma`
- Auth functions: `src/lib/server/auth.ts`
- Migration scripts: `scripts/migrate-to-user-roles.ts`
