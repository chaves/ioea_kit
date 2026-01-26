/**
 * Script to verify the database state
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('Verifying database state...\n');

  try {
    // Check if tables exist
    const usersTable = await prisma.$queryRawUnsafe<Array<{ [key: string]: string }>>(
      "SHOW TABLES LIKE 'users'"
    );
    const rolesTable = await prisma.$queryRawUnsafe<Array<{ [key: string]: string }>>(
      "SHOW TABLES LIKE 'roles'"
    );
    const userRolesTable = await prisma.$queryRawUnsafe<Array<{ [key: string]: string }>>(
      "SHOW TABLES LIKE 'user_roles'"
    );

    console.log('Tables:');
    console.log(`  ✓ users: ${usersTable.length > 0 ? 'EXISTS' : 'MISSING'}`);
    console.log(`  ✓ roles: ${rolesTable.length > 0 ? 'EXISTS' : 'MISSING'}`);
    console.log(`  ✓ user_roles: ${userRolesTable.length > 0 ? 'EXISTS' : 'MISSING'}\n`);

    if (usersTable.length > 0 && rolesTable.length > 0) {
      // Count records
      const userCount = await prisma.users.count();
      const roleCount = await prisma.roles.count();
      const userRoleCount = await prisma.user_roles.count();

      console.log('Records:');
      console.log(`  Users: ${userCount}`);
      console.log(`  Roles: ${roleCount}`);
      console.log(`  User-Role assignments: ${userRoleCount}\n`);

      // List roles
      const roles = await prisma.roles.findMany();
      console.log('Available roles:');
      roles.forEach((role) => {
        console.log(`  - ${role.name}: ${role.description || 'No description'}`);
      });

      console.log('\n✅ Database is up to date!');
    } else {
      console.log('⚠️  Some tables are missing. Run: npx tsx scripts/create-tables.ts');
    }
  } catch (error: any) {
    console.error('❌ Error verifying database:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️  Prisma client may need regeneration. Run: npx prisma generate');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
