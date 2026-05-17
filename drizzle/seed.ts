import { hash } from 'bcrypt';

import { db } from './drizzle-client';
import { users, validStudentTickets } from './schema.drizzle';

const HARDCODED_TICKETS = [
  15513294, 15513296, 15513292, 15513293, 15513290, 15513295, 15513289,
  15513291, 15513281, 15345777, 15345792, 15345774, 15345776, 15345775,
  15345787, 15345780, 15345781, 15345772, 15345793, 15345782, 15345795,
  15345778, 15345784, 15345791, 15345797, 15345789, 15345794, 15345783,
  15345790, 15345773, 15345785, 15345779, 15345786, 15345769, 15345771,
  15345770, 14942804, 15513276, 14838864, 14838847, 14838846, 14838844,
  14838860, 14838849, 14838855, 14838838, 14838852, 14838841, 14838853,
  14838850, 14838845, 14838856, 14838843, 14838869, 14838848, 14838851,
  14838854, 14838842, 14838858, 14482331, 14482332, 14315160, 14315164,
  14315144, 14315159, 14315136, 14315128, 14315124, 14315123, 14315142,
  14315132, 14315169, 14315166, 14315127, 14315162, 14315155, 14315133,
  14315130, 14315145, 14315126, 14315156, 14315135, 14315161, 14315121,
  14315158, 14315153, 14315148, 14315165, 14315150, 14315131, 14315168,
  14315146, 14315138, 15513278, 14315157, 14315117, 15513277, 14315139,
  13862363, 13862349, 13862342, 13862368, 13862357, 13862367, 13862354,
  13862378, 13862333, 15513284, 13862366, 14838865, 13862372, 13862340,
  13862356, 13862370, 13862341, 13862358, 13862339, 13862355, 13862353,
  13862365, 13862361, 13862381, 13862336, 13862334, 13862329, 13862331,
  15513282, 15513283, 13862375, 13862338, 13862371, 13862382, 13862374,
  13862326, 13862376, 13862352, 13862325, 13862373, 13862345, 13862332,
  13862377, 13862362,
];

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
      team: 'Правління',
      instagramLink: 'markiyankostur',
      telegramLink: 'markiyankostur',
      imageUrl:
        'https://storage.googleapis.com/radatut-test-bucket/team-members/8ff3f3c2693f362ba10ddc5b7fefbeedc6148cdf.png',
      provider: 'credentials',
    },
  ]);

  console.log('📄 Loading hardcoded student tickets...');

  if (HARDCODED_TICKETS.length > 0) {
    const ticketObjects = HARDCODED_TICKETS.map((ticket) => ({
      ticketNumber: String(ticket),
    }));

    console.log(
      `Inserting ${ticketObjects.length} tickets into the database...`,
    );

    await db.delete(validStudentTickets);

    await db
      .insert(validStudentTickets)
      .values(ticketObjects)
      .onConflictDoNothing();
  }

  console.log('✅ Seeding completed!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Seeding failed:');
  console.error(error);
  process.exit(1);
});
