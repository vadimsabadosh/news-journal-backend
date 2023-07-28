import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  private generateJwtToken(data: {
    id: number;
    email: string;
  }): Promise<string> {
    const payload = { sub: data.id, email: data.email };

    return this.jwtService.signAsync(payload);
  }

  async login(dto: LoginUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(dto.email);
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }
    const { password, ...result } = user;

    const token = await this.generateJwtToken(user);
    return {
      access_token: token,
      user: result,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const userExist = await this.usersService.findByEmail(createUserDto.email);
    if (userExist) {
      throw new BadRequestException(
        `User with email ${userExist.email} already exists`,
      );
    }
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const { password, ...result } = user;
    const token = await this.generateJwtToken(user);
    return {
      access_token: token,
      user: result,
    };
  }
}
