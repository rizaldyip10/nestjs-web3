import { User } from '../entities/user.entity';

export class UserDTO {
  id: number;
  username: string;
  email: string;
  avatar: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
  }
}
