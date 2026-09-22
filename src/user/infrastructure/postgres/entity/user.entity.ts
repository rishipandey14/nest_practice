import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    age!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    role_id!: number;

    @Column()
    password!: string;
}
