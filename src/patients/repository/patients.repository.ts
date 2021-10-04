import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreatePatientDto } from "../dto/create-patient.dto";
import { FindPatientQueryDto } from "../dto/find-patient-query.dto";
import { Patient } from "../entities/patient.entity";


@EntityRepository(Patient)
export class PatientReporitory extends Repository<Patient>{
    async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
        const { name, email, cpf, address, age, phone } = createPatientDto
        const patient = this.create()
        patient.name = name;
        patient.email = email;
        patient.cpf = cpf;
        patient.address = address;
        patient.age = age;
        patient.phone = phone;

        try {
            await this.save(patient)
            return patient;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('CPF e/ou E-mail já cadastrados');
            } else {
                throw new InternalServerErrorException(
                    error,
                );
            }
        }
    }

    async findPatient(queryDto: FindPatientQueryDto): Promise<{ patients: Patient[], total: number }> {
        queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
        queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

        try {
            const { cpf, email, name } = queryDto
            const query = this.createQueryBuilder('patient');
            if (email)
                query.where('patient.email ILIKE :email', { email: `%${email}%` });

            if (cpf)
                query.andWhere('patient.cpf ILIKE :cpf', { cpf: `%${cpf}%` })

            if (name)
                query.andWhere('patient.name ILIKE :name', { name: `%${name}%` });

            query.skip((queryDto.page - 1) * queryDto.limit);
            query.take(+queryDto.limit);
            query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
            query.select(['patient.name', 'patient.email', 'patient.cpf']);

            const [patients, total] = await query.getManyAndCount();

            return { patients, total };

        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}