/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];

    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });
      supermercadosList.push(supermercado);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermercado by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(
      storedSupermercado.id,
    );
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre),
      expect(Math.trunc(supermercado.latitud)).toEqual(
        Math.trunc(storedSupermercado.latitud),
      );
    expect(Math.trunc(supermercado.longitud)).toEqual(
      Math.trunc(storedSupermercado.longitud),
    );
    expect(supermercado.url_web).toEqual(storedSupermercado.url_web);
  });

  it('findOne should throw an exception for an invalid supermercado', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('create should return a new supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.string.alpha(12),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      url_web: faker.internet.url(),
      ciudades: [],
    };

    const newSupermercado: SupermercadoEntity =
      await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre),
      expect(Math.trunc(supermercado.latitud)).toEqual(
        Math.trunc(storedSupermercado.latitud),
      );
    expect(Math.trunc(supermercado.longitud)).toEqual(
      Math.trunc(storedSupermercado.longitud),
    );
    expect(supermercado.url_web).toEqual(storedSupermercado.url_web);
  });

  it('update should modify a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.longitud = 73;

    const updatedSupermercado: SupermercadoEntity = await service.update(
      supermercado.id,
      supermercado,
    );
    expect(updatedSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud);
  });

  it('update should throw an exception for an invalid supermercado', async () => {
    let supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado = {
      ...supermercado,
      longitud: 73,
    };
    await expect(() =>
      service.update('0', supermercado),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('delete should remove a supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);

    const deletedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermercado', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('create should throw an exception for duplicate supermercado', async () => {
    const originalSupermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.string.alpha(12),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      url_web: faker.internet.url(),
      ciudades: [],
    };

    // Intentar crear un supermercado con el mismo nombre
    await expect(() =>
      service.create({ ...originalSupermercado, id: '' }),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the same name already exists',
    );
  });
});
