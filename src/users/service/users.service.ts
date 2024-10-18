import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'src/utils/response.utils';
import { UserDTO } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (isUserExist) {
      throw new ConflictException(
        Response.failed(HttpStatus.CONFLICT, 'User already exist', null),
      );
    }

    const newUser = new User();

    Object.assign(newUser, createUserDto);

    const result = await this.userRepository.save(newUser);

    return Response.successful(
      HttpStatus.CREATED,
      'User created',
      new UserDTO(result),
    );
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'avatar'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, email } = updateUserDto;
    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new NotFoundException(
        Response.failed(HttpStatus.CONFLICT, 'User not found', null),
      );
    }

    const isEmailOrUsernameExist = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (isEmailOrUsernameExist) {
      throw new ConflictException(
        Response.failed(HttpStatus.CONFLICT, 'User already exist', null),
      );
    }

    Object.assign(updatedUser, updateUserDto);

    const result = await this.userRepository.save(updatedUser);

    return Response.successful(
      HttpStatus.OK,
      'User updated',
      new UserDTO(result),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
