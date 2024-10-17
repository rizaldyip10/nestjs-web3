import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'products', schema: 'public' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stocks: number;

  @Column({ nullable: true })
  image: string;

  @Column('simple-array', { nullable: true })
  buyers: string[];

  @Column('simple-array', { nullable: true })
  amountBought: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
