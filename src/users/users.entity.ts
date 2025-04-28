import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserAddress } from 'src/users/user-address.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  encryptedPassword: string;

  @Column()
  birthDate: Date;

  @OneToMany(() => UserAddress, address => address.user)
  addresses: UserAddress[];
}
