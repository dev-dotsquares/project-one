import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VideoSource } from '@common/enums';
import { User } from './user.entity';
import { Language } from './language.entity';

@Entity('videos')
@Index(['languageCode', 'isPublished'])
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({ type: 'char', length: 2 })
  languageCode!: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language?: Language;

  @Column({
    type: 'enum',
    enum: VideoSource,
  })
  source!: VideoSource;

  @Column({ type: 'varchar', length: 255, nullable: true })
  heygenVideoId?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileKey?: string;

  @Column({ type: 'int', nullable: true })
  durationSec?: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'boolean', default: false })
  isPublished!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'int' })
  createdBy!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}