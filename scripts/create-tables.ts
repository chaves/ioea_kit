/**
 * Script to create the new users, roles, and user_roles tables
 * Run this to set up the database schema for the new authentication system
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function createTables() {
  console.log('Creating new tables for authentication system...\n');

  try {
    // Create users table
    console.log('Creating users table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NULL,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        legacy_reviewer_id INT UNSIGNED NULL,
        legacy_student_id INT UNSIGNED NULL,
        legacy_reviewer_group TINYINT UNSIGNED NULL,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ users table created\n');

    // Create roles table
    console.log('Creating roles table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ roles table created\n');

    // Create user_roles table
    console.log('Creating user_roles table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        role_id INT UNSIGNED NOT NULL,
        granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        granted_by INT UNSIGNED NULL,
        UNIQUE KEY unique_user_role (user_id, role_id),
        INDEX idx_user_id (user_id),
        INDEX idx_role_id (role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✓ user_roles table created\n');

    // Insert default roles
    console.log('Inserting default roles...');
    await prisma.$executeRawUnsafe(`
      INSERT IGNORE INTO roles (name, description) VALUES
        ('admin', 'Administrator with full access'),
        ('reviewer', 'Reviewer who can review applications'),
        ('student', 'Student participant'),
        ('program-admin', 'Program administrator')
    `);
    console.log('✓ Default roles inserted\n');

    // Verify tables
    console.log('Verifying tables...');
    const usersCheck = await prisma.$queryRawUnsafe<Array<{ [key: string]: string }>>(
      "SHOW TABLES LIKE 'users'"
    );
    const rolesCheck = await prisma.$queryRawUnsafe<Array<{ [key: string]: string }>>(
      "SHOW TABLES LIKE 'roles'"
    );

    if (usersCheck.length > 0 && rolesCheck.length > 0) {
      console.log('✓ Verification successful\n');
    }

    console.log('✅ All tables created successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npx tsx scripts/migrate-to-user-roles.ts');
    console.log('2. Run: npx tsx scripts/hash-reviewer-passwords.ts');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
