import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem } from './entities/menu-item.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem]),
    JwtModule.register({}), // Needed for JWT guard
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
