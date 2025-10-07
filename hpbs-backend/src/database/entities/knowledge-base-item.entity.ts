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
import { KBType } from '@common/enums';
import { User } from './user.entity';
import { Language } from './language.entity';

@Entity('knowledge_base_items')
@Index(['languageCode', 'isPublished'])
@Index('idx_kb_fulltext', { synchronize: false }) // Created manually in migration
export class KnowledgeBaseItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 500 })
  title!: string;

  @Column({
    type: 'enum',
    enum: KBType,
  })
  type!: KBType;

  @Column({ type: 'char', length: 2 })
  languageCode!: string;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageCode', referencedColumnName: 'code' })
  language?: Language;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileKey?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fileMime?: string;

  @Column({ type: 'bigint', nullable: true })
  bytes?: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  checksum?: string;

  @Column({ type: 'text', nullable: true })
  extractedText?: string;

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