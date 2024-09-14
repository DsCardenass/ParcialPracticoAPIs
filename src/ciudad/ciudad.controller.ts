/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { CiudadDto } from '../ciudad/ciudad.dto/ciudad.dto';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':citiesId')
  async findOne(@Param('citiesId') ciudadId: string) {
    return await this.ciudadService.findOne(ciudadId);
  }

  @Post()
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @Put(':citiesId')
  async update(
    @Param('citiesId') ciudadId: string,
    @Body() ciudadDto: CiudadDto,
  ) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  @Delete(':citiesId')
  @HttpCode(204)
  async delete(@Param('citiesId') ciudadId: string) {
    return await this.ciudadService.delete(ciudadId);
  }
}
