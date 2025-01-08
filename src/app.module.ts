import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { User } from './auth/entities/user.entity';
import { MenuItem } from './menu/entities/menu-item.entity';
import { env } from './common/utils/envConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: () => env,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASS,
        database: env.DB_NAME,
        entities: [User, MenuItem],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MenuModule,
  ],
})
export class AppModule {}
