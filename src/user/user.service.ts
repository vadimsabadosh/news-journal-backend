import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return this.usersRepository.save(createUserDto);
    } catch (e) {
      throw new BadGatewayException('Something went wrong during registration');
    }
  }

  async getProfile(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const { password, ...result } = user;

    return result;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async search(dto: SearchUserDto) {
    const qb = this.usersRepository.createQueryBuilder('user');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.email) {
      qb.andWhere(`user.email ILIKE :email`, { email: `%${dto.email}%` });
    }
    if (dto.firstName) {
      qb.andWhere(`user.firstName ILIKE :firstName`, {
        firstName: `%${dto.firstName}%`,
      });
    }
    if (dto.lastName) {
      qb.andWhere(`user.lastName ILIKE :lastName`, {
        lastName: `%${dto.lastName}%`,
      });
    }
    const [users, count] = await qb.getManyAndCount();
    return {
      users,
      count,
    };
  }
  findByEmail(email: string) {
    try {
      return this.usersRepository.findOneBy({ email });
    } catch (e) {
      throw new BadGatewayException('Something went wrong');
    }
  }
  findById(id: number) {
    try {
      return this.usersRepository.findOneBy({ id });
    } catch (e) {
      throw new BadGatewayException('Something went wrong');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.usersRepository.update(id, updateUserDto);
    } catch (e) {
      throw new BadGatewayException('Something went wrong');
    }
  }
}
