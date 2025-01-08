import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationInterceptor } from '../common/interceptors/zod-validation.interceptor';
import {
  LoginSchema,
  RegisterSchema,
  loginBodySchema,
  registerBodySchema,
  LoginInput,
  RegisterInput,
} from './dto/auth.dto';
import { ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { zodToOpenAPI } from '../common/utils/zod-swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ schema: zodToOpenAPI(registerBodySchema) })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(new ZodValidationInterceptor(RegisterSchema))
  async register(@Body() body: RegisterInput) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ schema: zodToOpenAPI(loginBodySchema) })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(new ZodValidationInterceptor(LoginSchema))
  async login(@Body() body: LoginInput) {
    return this.authService.login(body.email, body.password);
  }
}
