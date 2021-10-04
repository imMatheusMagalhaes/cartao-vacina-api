import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Patient } from "./patient.entity";

@Entity()
export class Vaccine {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: 'varchar', length: 200 })
    date: string

    @Column({ nullable: false, type: 'varchar', length: 200 })
    lote: string

    @Column({ nullable: false, type: 'varchar', length: 200 })
    lab: string

    @Column({ nullable: false, type: 'varchar', length: 200 })
    us: string

    @OneToOne(() => Patient, (patient: Patient) => patient.vaccine)
    @JoinColumn({ name: "patientId" })
    patient: Patient

    @CreateDateColumn()
    createdAt: Date;

}