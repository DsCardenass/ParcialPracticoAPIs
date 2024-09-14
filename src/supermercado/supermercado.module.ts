/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoController } from './supermercado.controller';

@Module({
  providers: [SupermercadoService],
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  controllers: [SupermercadoController],
})
export class SupermercadoModule {}
