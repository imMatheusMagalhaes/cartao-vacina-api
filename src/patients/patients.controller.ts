import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FindPatientQueryDto } from './dto/find-patient-query.dto';
import { Patient } from './entities/patient.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { Vaccine } from './entities/vaccine.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post('create')
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientsService.create(createPatientDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const patient = await this.patientsService.findPatientById(id)

    return {
      patient,
      message: 'Usuário encontrado'
    }
  }

  @Patch(':id')
  async updatePatient(
    @Body(ValidationPipe) updatePatientDto: UpdatePatientDto,
    @Param('id') id: string) {
    return await this.patientsService.update(updatePatientDto, id)
  }

  @Get()
  async listUsers(@Query() query: FindPatientQueryDto) {
    const found = await this.patientsService.findPatient(query)
    return {
      found,
      message: 'Usuário encontrado'
    }
  }

  @Get()
  async findAll() {
    return await this.patientsService.findAll()
  }

  @Post('vaccines/:id')
  async createVaccine(@Body(ValidationPipe) createVaccineDto: CreateVaccineDto, @Param('id') id: string): Promise<Vaccine> {
    return await this.patientsService.createVaccine(createVaccineDto, id)
  }
}
