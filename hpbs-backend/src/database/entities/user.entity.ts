import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '@common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PUBLIC_USER,
  })
  role!: UserRole;

  @Column({ type: 'char', length: 2, default: 'en' })
  defaultLanguage!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarKey?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}