import { hash } from 'bcrypt';

import { db } from './drizzle-client';
import { users } from './schema.drizzle';

async function main() {
  console.log('🌱 Seeding database...');
  await db.delete(users);
  await db.insert(users).values([
    {
      fullName: 'Markian Kostur',
      email: 'rada.tyt2025@gmail.com',
      password: await hash('12345678', 10),
      role: 'ADMIN',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
      team: 'Управління',
      instagramLink: 'markiyankostur',
      telegramLink: 'markiyankostur',
      imageUrl:
        'https://storage.googleapis.com/radatut-test-bucket/team-members/8ff3f3c2693f362ba10ddc5b7fefbeedc6148cdf.png',
      provider: 'credentials',
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
