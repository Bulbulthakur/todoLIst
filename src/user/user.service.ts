/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // SIGNIN FUNCTION
  async create(payload: CreateUserDto): Promise<any> {
    const existemail = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    const existmobile = await this.prisma.user.findFirst({
      where: {
        mobile: payload.mobile,
      },
    });
    if (existemail) {
      throw new BadRequestException('User already exist with this email', {
        cause: new Error(),
        description: 'Some error description',
      });
    }
    if (existmobile) {
      throw new BadRequestException('User already exist with this mobile', {
        cause: new Error(),
        description: 'Some error description',
      });
    }

    const hash = await this.bcryptPassword(payload.password, 10);
    payload.password = hash;
    console.log(payload.password);

    return await this.prisma.user.create({
      data: payload,
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
      },
    });
  }

  // LOGIN FUNCTION
  async login(LoginDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: LoginDto.identifire }, { mobile: LoginDto.identifire }],
      },
    });
    console.log(LoginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ismatch = await this.decryptPassword(
      LoginDto.password,
      user.password,
    );
    if (!ismatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken: string = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
      },
      { expiresIn: '1h' },
    );
    return [
      {
        status: true,
        data: user,
        token: accessToken,
        msg: 'Login Successfully',
      },
    ];
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  // BCRYPT FUNCTION
  async bcryptPassword(plainText, saltRounds) {
    return await bcrypt.hash(plainText, saltRounds);
  }
  // BCRYPT FUNCTION
  async decryptPassword(plainText, hash) {
    return await bcrypt.compare(plainText, hash);
  }
}
