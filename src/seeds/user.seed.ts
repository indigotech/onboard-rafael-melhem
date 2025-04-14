import { DataSource } from 'typeorm';
import { User } from 'src/users/users.entity';

import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);

  const salt = 10;
  console.log('SEED_PASSWORD:', process.env.SEED_PASSWORD);

  for (let i = 1; i <= 50; i++) {
    const user = new User();
    user.name = `User ${i}`;
    user.email = `user${i}@example.com`;
    user.birthDate = new Date('1990-01-01');
    user.encryptedPassword = await bcrypt.hash(process.env.SEED_PASSWORD, salt);

    await userRepository.save(user);
    console.log(`Created user ${i}.`);
  }

  await AppDataSource.destroy();
  console.log('Seed done!');
}

seed().catch((err) => {
  console.error('Error: ', err);
});
