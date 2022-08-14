import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('Custom validation pipe...');

    const types: Function[] = [String, Boolean, Number, Array, Object];

    if (!metadata.metatype || types.includes(metadata.metatype)) {
      return value;
    }

    // It compares the passed object to its type class (which, if you use class-validator, includes decorators)
    const errors = await validate(plainToInstance(metadata.metatype, value));

    if (errors.length) {
      // Customize it the way you want
      throw new BadRequestException(errors);
    }

    return value;
  }
}
