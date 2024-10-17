import { User } from '../entities/user.entity';

export class UserDTO {
  username: string;
  email: string;
  avatar: string;
  id: number;
  createdAt: Date;

  constructor(user: User) {
    this.username = user.username;
    this.email = user.email;
    this.avatar = user.avatar;
    this.id = user.id;
    this.createdAt = user.createdAt;
  }
}
