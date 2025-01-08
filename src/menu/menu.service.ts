import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async create(createMenuItemDto: any): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.save(createMenuItemDto);
    return menuItem;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: MenuItem[]; total: number }> {
    const [data, total] = await this.menuItemRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
    return menuItem;
  }

  async update(id: string, updateMenuItemDto: any): Promise<MenuItem> {
    const menuItem = await this.findOne(id);
    Object.assign(menuItem, updateMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  async remove(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Menu item with ID "${id}" not found`);
    }
  }
}
