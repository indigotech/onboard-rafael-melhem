import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity()
export class UserAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;    

    @Column({ nullable: true })
    deletedAt: Date;

    @Column()
    cep: string;
    
    @Column()
    street: string; 

    @Column({ nullable: true })
    streetNumber?: string;

    @Column({ nullable: true })
    complement?: string; 

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

