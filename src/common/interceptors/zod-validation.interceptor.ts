import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private schema: ZodSchema) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const result = this.schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        path: error.path.join('.'),
        message: error.message,
      }));
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    return next.handle();
  }
}
