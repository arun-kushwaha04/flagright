import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handleError(error: Error): Error {
  if (error instanceof CustomHttpException) {
    throw error;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('Prisma Client Known Request Error:', error.message);

    if (error.code === 'P2002') {
      return new PrismaUniqueCosntraintError();
    } else if (error.code === 'P2003') {
      return new PrismaForeignKeyCosntraintError();
    } else if (error.code === 'P2025') {
      return new PrismaUpdateError();
    } else if (error.code === 'P2026') {
      return new PrismaUniquePropertyError();
    } else if (error.code === 'P2027') {
      return new PrismaMissingRecordError();
    } else if (error.code === 'P2023') {
      return new PrismaInvalidRecordError();
    } else {
      return new PrismaDefaultError();
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return new PrismaClientValidationError();
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return new PrismaClientInitializationError();
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new PrismaClientRustPanicError();
  } else {
    return new InternalServerError();
  }
}

class CustomHttpException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}

export class PrismaInvalidRecordError extends CustomHttpException {
  constructor() {
    super('Invalid record error', HttpStatus.BAD_REQUEST);
  }
}
export class PrismaUniqueCosntraintError extends CustomHttpException {
  constructor() {
    super(
      'A record with the same unique property already exists. Please check your input and try again',
      HttpStatus.CONFLICT,
    );
  }
}
export class PrismaForeignKeyCosntraintError extends CustomHttpException {
  constructor() {
    super(
      'The operation failed due to a foreign key constraint. Please check related records',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PrismaUpdateError extends CustomHttpException {
  constructor() {
    super(
      'The record you are trying to update does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class PrismaUniquePropertyError extends CustomHttpException {
  constructor() {
    super(
      'A required unique property is missing or invalid.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PrismaMissingRecordError extends CustomHttpException {
  constructor() {
    super(
      'The data provided is invalid. Please review your input and try again',
      HttpStatus.BAD_REQUEST,
    );
  }
}
export class PrismaDefaultError extends CustomHttpException {
  constructor() {
    super(
      'A known error occurred while processing your request. Please try again',
      HttpStatus.BAD_REQUEST,
    );
  }
}
export class PrismaClientValidationError extends CustomHttpException {
  constructor() {
    super(
      'There was a validation error with your request. Please check the input values',
      HttpStatus.BAD_REQUEST,
    );
  }
}
export class PrismaClientInitializationError extends CustomHttpException {
  constructor() {
    super(
      'There was an error initializing the database connection. Please contact support if the problem persists',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class PrismaClientRustPanicError extends CustomHttpException {
  constructor() {
    super(
      'An unexpected error occurred in the application. Please contact support',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidToken extends CustomHttpException {
  constructor() {
    super('Invalid token', HttpStatus.BAD_REQUEST);
  }
}

export class NoToken extends CustomHttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}

export class NotAuthorized extends CustomHttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidCredentials extends CustomHttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.BAD_REQUEST);
  }
}

export class EmailExists extends CustomHttpException {
  constructor() {
    super('User already registered, try signing', HttpStatus.BAD_REQUEST);
  }
}

export class InternalServerError extends CustomHttpException {
  constructor() {
    super(
      'An unexpected error occurred. Please try again later',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidUser extends CustomHttpException {
  constructor() {
    super(
      'Invalid! no user exits with provided user id',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DataFetchError extends CustomHttpException {
  constructor() {
    super('Unable to your reterive data', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class PlanAlreadyBought extends HttpException {
  constructor() {
    super('User already has a plan', HttpStatus.BAD_REQUEST);
  }
}

export class BankNotFound extends HttpException {
  constructor() {
    super('Bank not found', HttpStatus.NOT_FOUND);
  }
}

export class BankUserAlreadyExists extends HttpException {
  constructor() {
    super('User already member of the bank', HttpStatus.BAD_REQUEST);
  }
}

export class BankUserNotExists extends HttpException {
  constructor() {
    super('User not a member of the bank', HttpStatus.BAD_REQUEST);
  }
}

export class NotEnoughBalance extends HttpException {
  constructor() {
    super('Not enough balance', HttpStatus.BAD_REQUEST);
  }
}

export class SameUserSameAccountTransfer extends HttpException {
  constructor() {
    super(
      "Can't transfer between same account of an user",
      HttpStatus.BAD_REQUEST,
    );
  }
}
