import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from 'src/ecomm/products/entity/products.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { unique: true })
  productId!: string;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ default: 0 })
  quantity!: number;

  @Column({ default: 0 })
  reservedQuantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
