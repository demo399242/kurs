import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToClass } from 'class-transformer';

const errorText = (metadata: ArgumentMetadata) =>
  `Wrong ${metadata.type}-param <${metadata.data}>, please check it`;

@Injectable()
export class CityValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const str = String(value);
    if (str!='777') throw new HttpException(errorText(metadata), 901)
    return str;
  }
}

// @Injectable()
// export class ValidationPipe implements PipeTransform<any> {
//   async transform(value: any, { metatype }: ArgumentMetadata) {
//     if (!metatype || !this.toValidate(metatype)) {
//       return value;
//     }
//     const object = plainToClass(metatype, value);
//     const errors = await validate(object);
//     if (errors.length > 0) {
//       throw new BadRequestException('Validation failed');
//     }
//     return value;
//   }

//   private toValidate(metatype: Function): boolean {
//     const types: Function[] = [String, Boolean, Number, Array, Object];
//     return !types.includes(metatype);
//   }
// }