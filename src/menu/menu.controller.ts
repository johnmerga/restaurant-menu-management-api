import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationInterceptor } from '../common/interceptors/zod-validation.interceptor';
import {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  GetMenuItemSchema,
} from './dto/menu-item.dto';
import { PaginationSchema } from 'src/common/dto/pagination.dto';
import { ApiBody } from '@nestjs/swagger';
import { zodToOpenAPI } from 'src/common/utils/zod-swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/auth.types';

@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  @Auth('admin')
  @UseInterceptors(new ZodValidationInterceptor(CreateMenuItemSchema))
  @ApiBody({ schema: zodToOpenAPI(CreateMenuItemSchema.shape.body) })
  create(@Body() createMenuItemDto: any, @CurrentUser() user: JwtPayload) {
    console.log(user);
    return this.menuService.create(createMenuItemDto);
  }

  @Get()
  @UseInterceptors(new ZodValidationInterceptor(PaginationSchema))
  async findAll(@Query() query: any) {
    const { page, limit } = query;
    return this.menuService.findAll(page, limit);
  }

  @Get(':id')
  @UseInterceptors(new ZodValidationInterceptor(GetMenuItemSchema))
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(new ZodValidationInterceptor(UpdateMenuItemSchema))
  update(@Param('id') id: string, @Body() updateMenuItemDto: any) {
    return this.menuService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @UseInterceptors(new ZodValidationInterceptor(GetMenuItemSchema))
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
