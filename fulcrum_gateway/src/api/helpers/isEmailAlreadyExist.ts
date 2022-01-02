import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import prisma from '../prismaClient';

@ValidatorConstraint({ async: false })
export class isEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {

    const organizer = await prisma.organizer.findUnique({
      where: {
        email: email,
      }
    });

    if (organizer){
      return true;
    }

    return false;

  }
}

export function isEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isEmailAlreadyExistConstraint
    });
  };
}
