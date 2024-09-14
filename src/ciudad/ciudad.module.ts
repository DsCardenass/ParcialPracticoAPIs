/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CiudadService } from '../ciudad/ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { CiudadController } from '../ciudad/ciudad.controller';

@Module({
  providers: [CiudadService],
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  controllers: [CiudadController],
})
export class CiudadModule {}
