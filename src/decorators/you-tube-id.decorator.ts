import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsYouTubeIdConstraint implements ValidatorConstraintInterface {
  validate(id: any): boolean {
    const youtubeRegex = /^[a-zA-Z0-9_-]{11}$/;
    return typeof id === 'string' && youtubeRegex.test(id);
  }

  defaultMessage(): string {
    return 'ID de vídeo do YouTube inválido. Deve conter exatamente 11 caracteres válidos.';
  }
}

export function IsYouTubeId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsYouTubeIdConstraint,
    });
  };
}
