import { hash } from 'bcrypt';

const test = async () => {
  console.log(await hash('12345678', 10));
};

test();