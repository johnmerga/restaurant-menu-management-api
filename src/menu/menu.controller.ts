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
  UploadedFile,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationInterceptor } from '../common/interceptors/zod-validation.interceptor';
import {
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  GetMenuItemSchema,
} from './dto/menu-item.dto';
import { diskStorage } from 'multer';
import { PaginationSchema } from 'src/common/dto/pagination.dto';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { zodToOpenAPI } from 'src/common/utils/zod-swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/auth.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  @Post()
  @Auth('admin')
  @UseInterceptors(new ZodValidationInterceptor(CreateMenuItemSchema))
  @ApiBody({ schema: zodToOpenAPI(CreateMenuItemSchema.shape.body) })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/menu-photos',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() createMenuItemDto: any,
    @UploadedFile() photo: Express.Multer.File, // Correct type
    @CurrentUser() user: JwtPayload,
  ) {
    console.log(user);
    createMenuItemDto.photo = photo.filename; // Save the filename to the DTO
    return this.menuService.create(createMenuItemDto);
  }

  @Get()
  @UseInterceptors(new ZodValidationInterceptor(PaginationSchema))
  @ApiQuery({
    name: 'page',
    default: 1,
  })
  async findAll(@Query() query: any) {
    const { page, limit } = query;
    return this.menuService.findAll(+page, +limit);
  }

  @Get(':id')
  @UseInterceptors(new ZodValidationInterceptor(GetMenuItemSchema))
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @Auth('admin')
  @UseInterceptors(new ZodValidationInterceptor(UpdateMenuItemSchema))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/menu-photos',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateMenuItemDto: any,
    @UploadedFile() photo?: Express.Multer.File, // Make the photo optional
  ) {
    if (photo) {
      updateMenuItemDto.photo = photo.filename; // Save the filename to the DTO if a photo is uploaded
    }
    return this.menuService.update(id, updateMenuItemDto);
  }

  @Delete(':id')
  @UseInterceptors(new ZodValidationInterceptor(GetMenuItemSchema))
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
