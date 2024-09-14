/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {
  private readonly paisValidacion = ['Argentina', 'Ecuador', 'Paraguay'];

  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['supermercados'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['supermercados'],
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (!this.paisValidacion.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `El país ${ciudad.pais} no está permitido. Solo se permiten: Argentina, Ecuador, Paraguay.`,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });

    if (!persistedCiudad) {
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    if (ciudad.pais && !this.paisValidacion.includes(ciudad.pais)) {
      throw new BusinessLogicException(
        `El país ${ciudad.pais} no está permitido. Solo se permiten: Argentina, Ecuador, Paraguay.`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.ciudadRepository.save({
      ...persistedCiudad,
      ...ciudad,
    });
  }

  async delete(id: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.ciudadRepository.remove(ciudad);
  }
}