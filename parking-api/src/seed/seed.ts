import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../modules/users/domain/ports/user.repository';
import {
  PARKING_SPOT_REPOSITORY,
  ParkingSpotRepository,
} from '../modules/spots/domain/ports/parking-spot.repository';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../shared/hashing/domain/ports/password-hasher.port';
import { User } from '../modules/users/domain/entities/user.entity';
import { Email } from '../modules/users/domain/value-objects/email.vo';
import { Role } from '../modules/users/domain/enums/role.enum';
import { ParkingSpot } from '../modules/spots/domain/entities/parking-spot.entity';

const DEFAULT_PASSWORD = 'password123';

const USERS: Array<{ email: string; role: Role }> = [
  { email: 'admin@parking.com', role: Role.Admin },
  { email: 'empleado@parking.com', role: Role.Employee },
  { email: 'cliente@parking.com', role: Role.Client },
];

const SPOT_CODES = ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'B-01', 'B-02'];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const users = app.get<UserRepository>(USER_REPOSITORY, { strict: false });
  const spots = app.get<ParkingSpotRepository>(PARKING_SPOT_REPOSITORY, {
    strict: false,
  });
  const hasher = app.get<PasswordHasher>(PASSWORD_HASHER, { strict: false });

  const passwordHash = await hasher.hash(DEFAULT_PASSWORD);

  for (const { email, role } of USERS) {
    const emailVo = new Email(email);
    if (await users.findByEmail(emailVo)) {
      console.log(`· usuario ya existe, omitido: ${email}`);
      continue;
    }
    await users.save(User.create({ email: emailVo, passwordHash, role }));
    console.log(`✓ usuario creado: ${email} (${role})`);
  }

  for (const code of SPOT_CODES) {
    if (await spots.findByCode(code)) {
      console.log(`· plaza ya existe, omitida: ${code}`);
      continue;
    }
    await spots.save(ParkingSpot.create(code));
    console.log(`✓ plaza creada: ${code}`);
  }

  console.log(`
  \nContraseña de todos los usuarios sembrados: ${DEFAULT_PASSWORD}
`);
  await app.close();
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fallo el seed:', error);
    process.exit(1);
  });
