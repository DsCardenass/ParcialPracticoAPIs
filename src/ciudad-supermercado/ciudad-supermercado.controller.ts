/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CiudadSupermercadoService } from '../ciudad-supermercado/ciudad-supermercado.service';
import { SupermercadoDto } from '../supermercado/supermercado.dto/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';

@Controller('cities')
export class CiudadSupermercadoController {
  constructor(
    private readonly ciudadSupermercadoService: CiudadSupermercadoService,
  ) {}

  @Post(':citiesId/supermarkets/:supermarketsId')
  async addSupermercadoCiudad(
    @Param('citiesId') cityId: string,
    @Param('supermarketsId') supermarketId: string,
  ) {
    return await this.ciudadSupermercadoService.addSupermarketToCity(
      cityId,
      supermarketId,
    );
  }

  @Put(':citiesId/supermarkets')
  async associateSupermercadoCiudad(
    @Body() michelinstarDto: SupermercadoDto[],
    @Param('citiesId') cityId: string,
  ) {
    const michelinstars = plainToInstance(SupermercadoEntity, michelinstarDto);
    return await this.ciudadSupermercadoService.updateSupermarkersFromCity(
      cityId,
      michelinstars,
    );
  }

  @Get(':citiesId/supermarkets/:supermarketsId')
  async findSupermercadoByCiudadIdSupermercadoId(
    @Param('citiesId') cityId: string,
    @Param('supermarketsId') supermarketId: string,
  ) {
    return await this.ciudadSupermercadoService.findSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }

  @Get(':citiesId/supermarkets')
  async findSupermercadosByCiudadId(@Param('citiesId') cityId: string) {
    return await this.ciudadSupermercadoService.findSupermarketsFromCity(
      cityId,
    );
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermercadoCiudad(
    @Param('citiesId') cityId: string,
    @Param('supermarketsId') supermarketId: string,
  ) {
    return await this.ciudadSupermercadoService.deleteSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }
}
