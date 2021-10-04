import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { FindPatientQueryDto } from './dto/find-patient-query.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientReporitory } from './repository/patients.repository';
import { VaccineReporitory } from './repository/vaccine.repository';

@Injectable()
export class PatientsService {

  constructor(
    @InjectRepository(PatientReporitory) private readonly patientRepository: PatientReporitory,
    @InjectRepository(VaccineReporitory) private readonly vaccineRepository: VaccineReporitory
  ) { }
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientRepository.createPatient(createPatientDto)
  }

  async findPatientById(id: string) {
    const patient = await this.patientRepository.findOne(id,
      { select: ['name', 'email', 'address', 'phone', 'cpf', 'age', 'vaccine', 'id'] })


    if (!patient)
      throw new NotFoundException('Usuário não encontrado')

    return patient
  }

  async update(updatePatientDto: UpdatePatientDto, id: string): Promise<Patient> {
    const patient = await this.findPatientById(id)
    const { address, age, cpf, email, name, phone } = updatePatientDto

    patient.email = email ? email : patient.email
    patient.age = age ? age : patient.age
    patient.cpf = cpf ? cpf : patient.cpf
    patient.address = address ? address : patient.address
    patient.name = name ? name : patient.name
    patient.phone = phone ? phone : patient.phone

    try {
      await this.patientRepository.save(patient)
      return patient
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }

  // async delete(id: string) {

  //   const result = await this.patientRepository.delete({ id: Number(id) })
  //   if (result.affected === 0) {
  //     throw new NotFoundException(
  //       'Não foi encontrado um usuário com o ID informado',
  //     );
  //   }
  // }

  async findPatient(
    queryDto: FindPatientQueryDto,
  ): Promise<{ patients: Patient[]; total: number }> {
    const patients = await this.patientRepository.findPatient(queryDto);
    return patients;
  }

  async createVaccine(createVaccineDto: CreateVaccineDto) {
    return this.vaccineRepository.createVaccine(createVaccineDto)
  }
}
