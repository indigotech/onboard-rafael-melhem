import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cep: string;
    
    @Column()
    street: string; 

    @Column()
    streetNumber: number;

    @Column()
    complement: string; 

    @Column()
    neighborhood: string; 

    @Column()
    city: string; 

    @Column()
    state: string; 

    @ManyToOne(() => User, user => user.addresses)
    @JoinColumn({ name: 'user_id' }) 
    user: User
}

