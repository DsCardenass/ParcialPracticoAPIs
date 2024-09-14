/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from '../ciudad/ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadsList: CiudadEntity[];
  const paisValidacion = ['Argentina', 'Ecuador', 'Paraguay'];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    ciudadsList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        pais: faker.helpers.arrayElement(paisValidacion),
        num_habitantes: faker.number.int({ min: 10000, max: 1000000 }),
      });
      ciudadsList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all ciudads', async () => {
    const ciudads: CiudadEntity[] = await service.findAll();
    expect(ciudads).not.toBeNull();
    expect(ciudads).toHaveLength(ciudadsList.length);
  });

  it('findOne should return a ciudad by id', async () => {
    const storedCiudad: CiudadEntity = ciudadsList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.num_habitantes).toEqual(storedCiudad.num_habitantes);
  });

  it('findOne should throw an exception for an invalid ciudad', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('create should return a new ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.location.city(),
      pais: faker.helpers.arrayElement(paisValidacion),
      num_habitantes: faker.number.int({ min: 10000, max: 1000000 }),
      supermercados: [],
    };

    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: newCiudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
    expect(ciudad.pais).toEqual(storedCiudad.pais);
    expect(ciudad.num_habitantes).toEqual(storedCiudad.num_habitantes);
  });

  it('update should modify a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadsList[0];
    ciudad.nombre = 'New name';

    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
  });

  it('update should throw an exception for an invalid ciudad', async () => {
    let ciudad: CiudadEntity = ciudadsList[0];
    ciudad = {
      ...ciudad,
      nombre: 'New name',
    };
    await expect(() => service.update('0', ciudad)).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('delete should remove a ciudad', async () => {
    const ciudad: CiudadEntity = ciudadsList[0];
    await service.delete(ciudad.id);

    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid ciudad', async () => {
    const ciudad: CiudadEntity = ciudadsList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });
});
