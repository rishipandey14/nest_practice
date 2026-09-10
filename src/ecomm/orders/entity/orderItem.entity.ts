import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  orderId!: string;

  @Column('uuid')
  productId!: string;

  @Column()
  quantity!: number;

  // Price at the time of purchase
  @Column('decimal', {
    precision: 12,
    scale: 2,
  })
  price!: number;

  @ManyToOne(
    () => Order,
    (order) => order.items,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'orderId' })
  order!: Order;
}
