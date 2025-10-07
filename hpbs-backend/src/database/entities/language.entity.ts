import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('languages')
export class Language {
  @PrimaryColumn({ type: 'char', length: 2 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}