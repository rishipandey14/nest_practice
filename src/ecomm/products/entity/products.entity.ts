import { Category } from 'src/ecomm/category/entity/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id !: string;

  @Column()
  name !: string;

  @Column('text')
  description !: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price !: number;

  @Column({ default: 0 })
  stock !: number;

  @Column({ default: true })
  isActive !: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({name: 'categoryId'})
  category !: Category;

  @Column('uuid')
  categoryId !: string;

  @CreateDateColumn()
  created_at !: Date;

  @UpdateDateColumn()
  updated_at !: Date;
}
