/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors } from '@nestjs/common';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { SupermercadoDto } from '../supermercado/supermercado.dto/supermercado.dto';
import { plainToInstance } from 'class-transformer';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly supermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.supermercadoService.findAll();
  }

  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermercadoId: string) {
    return await this.supermercadoService.findOne(supermercadoId);
  }

  @Post()
  async create(@Body() supermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.supermercadoService.create(supermercado);
  }

  @Put(':supermarketId')
  async update(
    @Param('supermarketId') supermercadoId: string,
    @Body() supermercadoDto: SupermercadoDto,
  ) {
    const supermercado: SupermercadoEntity = plainToInstance(
      SupermercadoEntity,
      supermercadoDto,
    );
    return await this.supermercadoService.update(supermercadoId, supermercado);
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermercadoId: string) {
    return await this.supermercadoService.delete(supermercadoId);
  }
}
