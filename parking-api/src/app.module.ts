import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { envValidationSchema } from './config/env.validation';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // validación al arranque
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PG_HOST'),
        port: config.get<number>('PG_PORT'),
        username: config.get<string>('PG_USER'),
        password: config.get<string>('PG_PASSWORD'),
        database: config.get<string>('PG_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
