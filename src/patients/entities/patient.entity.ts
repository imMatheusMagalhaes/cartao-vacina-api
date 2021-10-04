import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Vaccine } from "./vaccine.entity";


@Entity()
@Unique(['cpf', 'email'])
export class Patient {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: 'varchar', length: 200 })
    email: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    name: string

    @Column({ nullable: false, type: 'varchar', length: 200 })
    address: string

    @Column({ nullable: false, type: 'varchar', length: 12 })
    phone: string

    @Column({ nullable: false, type: 'varchar', length: 11 })
    cpf: string

    @Column({ nullable: false, type: 'varchar', length: 10 })
    age: string

    @OneToOne(() => Vaccine, (vaccine: Vaccine) => vaccine.patient)
    vaccine: Vaccine

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
