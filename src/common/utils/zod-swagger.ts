import { z } from 'zod';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function zodToOpenAPI(schema: z.ZodType<any, any>): SchemaObject {
  const zodObject =
    schema instanceof z.ZodObject ? schema : z.object({ data: schema });

  return {
    type: 'object',
    properties: Object.entries(zodObject.shape).reduce((acc, [key, value]) => {
      acc[key] = getSchemaForZodType(value as z.ZodType<any, any>);
      return acc;
    }, {}),
    required: Object.entries(zodObject.shape)
      .filter(([_, value]) => !(value instanceof z.ZodOptional))
      .map(([key]) => key),
  };
}

function getSchemaForZodType(zodType: z.ZodType<any, any>): SchemaObject {
  if (zodType instanceof z.ZodString) {
    return { type: 'string' };
  }
  if (zodType instanceof z.ZodNumber) {
    return { type: 'number' };
  }
  if (zodType instanceof z.ZodBoolean) {
    return { type: 'boolean' };
  }
  if (zodType instanceof z.ZodArray) {
    return {
      type: 'array',
      items: getSchemaForZodType(zodType.element),
    };
  }
  if (zodType instanceof z.ZodObject) {
    return zodToOpenAPI(zodType);
  }
  if (zodType instanceof z.ZodEnum) {
    return {
      type: 'string',
      enum: zodType._def.values,
    };
  }
  if (zodType instanceof z.ZodOptional) {
    return getSchemaForZodType(zodType.unwrap());
  }

  return { type: 'string' }; // fallback
}
