import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { HashingModule } from '../../shared/hashing/hashing.module';
import { TOKEN_ISSUER } from './domain/ports/token-issuer.port';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    UsersModule,
    HashingModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
  ],
})
export class AuthModule {}
