/**
 * Migration script to migrate from call_reviewers/students to users/roles system
 * Run this after creating the new tables in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define role names
const ROLES = {
  ADMIN: 'admin',
  REVIEWER: 'reviewer',
  STUDENT: 'student',
  PROGRAM_ADMIN: 'program-admin',
} as const;

async function createRoles() {
  console.log('Creating roles...');

  const rolesToCreate = [
    { name: ROLES.ADMIN, description: 'Administrator with full access' },
    { name: ROLES.REVIEWER, description: 'Reviewer who can review applications' },
    { name: ROLES.STUDENT, description: 'Student participant' },
    { name: ROLES.PROGRAM_ADMIN, description: 'Program administrator' },
  ];

  for (const roleData of rolesToCreate) {
    await prisma.roles.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
    console.log(`✓ Role "${roleData.name}" created/verified`);
  }
}

async function migrateReviewers() {
  console.log('\nMigrating reviewers...');

  const reviewers = await prisma.call_reviewers.findMany();
  const adminRole = await prisma.roles.findUnique({ where: { name: ROLES.ADMIN } });
  const reviewerRole = await prisma.roles.findUnique({ where: { name: ROLES.REVIEWER } });

  if (!adminRole || !reviewerRole) {
    throw new Error('Roles must be created first');
  }

  for (const reviewer of reviewers) {
    // Check if user already exists
    let user = await prisma.users.findUnique({
      where: { email: reviewer.email },
    });

    if (!user) {
      // Create new user (password will need to be hashed separately)
      user = await prisma.users.create({
        data: {
          email: reviewer.email,
          name: reviewer.name,
          password_hash: null, // Will need manual update with bcrypt
          legacy_reviewer_id: reviewer.id,
          legacy_reviewer_group: reviewer.group,
        },
      });
      console.log(`✓ Created user: ${user.email}`);
    }

    // Assign role based on reviewer type
    const roleId = reviewer.type === 'manager' ? adminRole.id : reviewerRole.id;

    await prisma.user_roles.upsert({
      where: {
        user_id_role_id: {
          user_id: user.id,
          role_id: roleId,
        },
      },
      update: {},
      create: {
        user_id: user.id,
        role_id: roleId,
      },
    });

    console.log(`  → Assigned role "${reviewer.type === 'manager' ? 'admin' : 'reviewer'}" to ${user.email}`);
  }

  console.log(`\n✓ Migrated ${reviewers.length} reviewers`);
}

async function migrateStudents() {
  console.log('\nMigrating students...');

  const students = await prisma.students.findMany();
  const studentRole = await prisma.roles.findUnique({ where: { name: ROLES.STUDENT } });

  if (!studentRole) {
    throw new Error('Student role must be created first');
  }

  let created = 0;
  let skipped = 0;

  for (const student of students) {
    // Check if user already exists
    let user = await prisma.users.findUnique({
      where: { email: student.email },
    });

    if (!user) {
      // Create new user (no password - email-only auth for now)
      user = await prisma.users.create({
        data: {
          email: student.email,
          name: `${student.first_name} ${student.last_name}`,
          password_hash: null,
          legacy_student_id: student.id,
        },
      });
      created++;
      console.log(`✓ Created user: ${user.email}`);
    } else {
      skipped++;
    }

    // Assign student role
    await prisma.user_roles.upsert({
      where: {
        user_id_role_id: {
          user_id: user.id,
          role_id: studentRole.id,
        },
      },
      update: {},
      create: {
        user_id: user.id,
        role_id: studentRole.id,
      },
    });
  }

  console.log(`\n✓ Migrated ${created} students (${skipped} already existed)`);
}

async function main() {
  try {
    console.log('Starting migration to user/roles system...\n');

    await createRoles();
    await migrateReviewers();
    await migrateStudents();

    console.log('\n✅ Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: Reviewers need their passwords hashed.');
    console.log('   Run a separate script to hash existing passwords using bcrypt.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
