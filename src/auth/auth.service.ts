import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import {
  JwtPayload,
  LoginResponse,
  TokenResponse,
} from '../auth/types/auth.types';
import { env } from 'src/common/utils/envConfig';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{
    access_token: string;
    email: string;
    name: string;
    roles: string[];
  }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      roles: ['user'],
    });

    await this.userRepository.save(user);
    const { password: _, ...result } = user;
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: env.JWT_SECRET,
    });
    return {
      ...result,
      access_token: token,
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      user: {
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      access_token: await this.jwtService.signAsync(payload, {
        secret: env.JWT_SECRET,
      }),
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
}
