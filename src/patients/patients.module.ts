import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PatientReporitory } from './repository/patients.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccineReporitory } from './repository/vaccine.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientReporitory, VaccineReporitory])],
  controllers: [PatientsController],
  providers: [PatientsService]
})
export class PatientsModule { }
