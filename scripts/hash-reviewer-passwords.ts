/**
 * Script to hash existing reviewer passwords from call_reviewers table
 * Run this after migrating users to hash their passwords
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashReviewerPasswords() {
  console.log('Hashing reviewer passwords...\n');

  // Get all reviewers with passwords
  const reviewers = await prisma.call_reviewers.findMany();

  console.log(`Found ${reviewers.length} reviewers to process\n`);

  for (const reviewer of reviewers) {
    try {
      // Find corresponding user
      const user = await prisma.users.findFirst({
        where: {
          email: reviewer.email,
        },
      });

      if (!user) {
        console.log(`⚠️  No user found for reviewer ${reviewer.email}, skipping...`);
        continue;
      }

      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (reviewer.password.startsWith('$2')) {
        console.log(`✓ Password for ${reviewer.email} is already hashed`);
        // Update user with existing hash
        await prisma.users.update({
          where: { id: user.id },
          data: { password_hash: reviewer.password },
        });
        continue;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(reviewer.password, 10);

      // Update user with hashed password
      await prisma.users.update({
        where: { id: user.id },
        data: { password_hash: hashedPassword },
      });

      console.log(`✓ Hashed password for ${reviewer.email}`);
    } catch (error) {
      console.error(`❌ Error processing ${reviewer.email}:`, error);
    }
  }

  console.log(`\n✅ Completed hashing passwords for ${reviewers.length} reviewers`);
}

async function main() {
  try {
    await hashReviewerPasswords();
  } catch (error) {
    console.error('❌ Script failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
