import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateVaccineDto } from "../dto/create-vaccine.dto";
import { Patient } from "../entities/patient.entity";
import { Vaccine } from "../entities/vaccine.entity";

@EntityRepository(Vaccine)
export class VaccineReporitory extends Repository<Vaccine>{
    async createVaccine(createVaccineDto: CreateVaccineDto, patient: Patient): Promise<any> {
        const { date, lab, lote, us } = createVaccineDto
        const vaccine = this.create()
        vaccine.date = date
        vaccine.lab = lab
        vaccine.lote = lote
        vaccine.us = us
        vaccine.patient = patient
        try {
            await this.save(vaccine)
            return vaccine
        } catch (error) {
            throw new InternalServerErrorException('Erro ao salvar o usuário no banco de dados')
        }
    }
}