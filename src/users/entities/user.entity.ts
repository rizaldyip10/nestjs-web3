import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities/product.entity';

@Entity({ name: 'users', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true, nullable: false, name: 'username' })
  username: string;

  @Column({ length: 255, unique: true, nullable: false, name: 'email' })
  email: string;

  @Column({ nullable: false, name: 'password_hash' })
  password: string;

  @Column({ nullable: true, name: 'avatar' })
  avatar: string;

  @Column({ nullable: true, name: 'wallet_address' })
  walletAddress: string;

  @OneToMany(() => Product, (product) => product.owner)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
