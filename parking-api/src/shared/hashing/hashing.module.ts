import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './domain/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';

@Module({
  providers: [{ provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher }],
  exports: [PASSWORD_HASHER],
})
export class HashingModule {}
