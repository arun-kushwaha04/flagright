import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ICreateUser } from './dto/create-user.dto';
import { User, UserType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  BankNotFound,
  EmailExists,
  handleError,
  InvalidCredentials,
} from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserCredentials } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async singUp(data: ICreateUser): Promise<User | void> {
    try {
      // checking if the provided bank id exists
      const bankId = data.defaultBankId;
      const bank = await this.prisma.bank.findUnique({
        where: {
          id: bankId,
        },
      });
      if (!bank) throw new BankNotFound();

      // hashing the password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      // inserting the user in the database
      const user = await this.prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          userType: data.userType,
          banks: {
            create: [
              {
                bank: {
                  connect: {
                    id: bankId,
                  },
                },
                balance: 0,
              },
            ],
          },
          defaultBank: {
            connect: {
              id: bankId,
            },
          },
        },
      });
      return user;
    } catch (error) {
      console.log('Sign up error', error);
      if (error instanceof PrismaClientKnownRequestError) {
        // handling dupolicate user email id creation
        if (error.code === 'P2002') {
          throw new EmailExists();
        }
      }
      throw handleError(error);
    }
  }

  async validateUser(email: string, password: string): Promise<number> {
    // finding user with the provided email id
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // throwing error if user not found
    if (!user) throw new InvalidCredentials();

    // matching the hashed password stored in db with the provided password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new InvalidCredentials();

    return user.id;
  }

  async signIn(data: IUserCredentials): Promise<string> {
    try {
      // validating the user with the provided credentials
      const userId = await this.validateUser(data.email, data.password);
      // generating taken
      const token = await this.jwtService.signAsync({ userId });
      return token;
    } catch (error) {
      console.error('Login error: ', error);
      throw handleError(error);
    }
  }

  async userExists(
    userId: number,
  ): Promise<{ isAdmin: boolean; exists: boolean }> {
    // checking if user exists with given userId
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user)
      return {
        exists: true,
        isAdmin: user.userType === UserType.ADMIN,
      };
    return {
      exists: false,
      isAdmin: false,
    };
  }
}
