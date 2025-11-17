// dia-api/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealModule } from './meal/meal.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GlucoseModule } from './glucose/glucose.module';
import { InsulinModule } from './insulin/insulin.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    // Carrega variáveis do .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexão com Postgres (Supabase)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'), // vem do .env

        autoLoadEntities: true,
        synchronize: true, // em dev, cria/atualiza as tabelas

        // 👇 Parte importante para o erro de certificado:
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    AuthModule,
    UsersModule,
    GlucoseModule,
    InsulinModule,
    MealModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
