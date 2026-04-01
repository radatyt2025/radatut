import { db } from './drizzle-client';
import { users } from './schema.drizzle';

async function main() {
  console.log('🌱 Seeding database...');
  await db.delete(users);
  await db.insert(users).values([
    {
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      password: '12345678',
    },
    {
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      password: '12345678',
    },
  ]);

  console.log('✅ Seeding completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Seeding failed:');
  console.error(error);
  process.exit(1);
});
