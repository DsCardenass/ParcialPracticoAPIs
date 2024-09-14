/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from '../ciudad-supermercado/ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          nombre: faker.string.alpha(12),
          longitud: faker.location.longitude(),
          latitud: faker.location.latitude(),
          url_web: faker.internet.url(),
        });
      supermercadosList.push(supermercado);
    }
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      num_habitantes: faker.number.int({ min: 10000, max: 1000000 }),
      supermercados: supermercadosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoCiudad should add an supermercado to a ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      num_habitantes: faker.number.int({ min: 10000, max: 1000000 }),
    });

    const result: CiudadEntity = await service.addSupermarketToCity(
      newCiudad.id,
      newSupermercado.id,
    );

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toEqual(newSupermercado.nombre),
      expect(Math.trunc(result.supermercados[0].latitud)).toEqual(
        Math.trunc(newSupermercado.latitud),
      );
    expect(Math.trunc(result.supermercados[0].longitud)).toEqual(
      Math.trunc(newSupermercado.longitud),
    );
    expect(result.supermercados[0].url_web).toEqual(newSupermercado.url_web);
  });

  it('addSupermercadoCiudad should thrown exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      num_habitantes: faker.number.int({ min: 10000, max: 1000000 }),
    });

    await expect(() =>
      service.addSupermarketToCity(newCiudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('addSupermercadoCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    await expect(() =>
      service.addSupermarketToCity('0', newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('findSupermercadoByCiudadIdSupermercadoId should return supermercado by ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity =
      await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre),
      expect(Math.trunc(storedSupermercado.latitud)).toEqual(
        Math.trunc(supermercado.latitud),
      );
    expect(Math.trunc(storedSupermercado.longitud)).toEqual(
      Math.trunc(supermercado.longitud),
    );
    expect(storedSupermercado.url_web).toEqual(supermercado.url_web);
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid supermercado', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('findSupermercadoByCiudadIdSupermercadoId should throw an exception for an supermercado not associated to the ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id is not associated to the ciudad',
    );
  });

  it('findSupermercadosByCiudadId should return supermercados by ciudad', async () => {
    const supermercados: SupermercadoEntity[] =
      await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5);
  });

  it('findSupermercadosByCiudadId should throw an exception for an invalid ciudad', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('associateSupermercadosCiudad should update supermercados list for a ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    const updatedCiudad: CiudadEntity =
      await service.updateSupermarkersFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toEqual(
      newSupermercado.nombre,
    ),
      expect(Math.trunc(updatedCiudad.supermercados[0].latitud)).toEqual(
        Math.trunc(newSupermercado.latitud),
      );
    expect(Math.trunc(updatedCiudad.supermercados[0].longitud)).toEqual(
      Math.trunc(newSupermercado.longitud),
    );
    expect(updatedCiudad.supermercados[0].url_web).toEqual(
      newSupermercado.url_web,
    );
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    await expect(() =>
      service.updateSupermarkersFromCity('0', [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('associateSupermercadosCiudad should throw an exception for an invalid supermercado', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = '0';

    await expect(() =>
      service.updateSupermarkersFromCity(ciudad.id, [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('deleteSupermercadoToCiudad should remove an supermercado from a ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity =
      storedCiudad.supermercados.find((a) => a.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid supermercado', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an invalid ciudad', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('deleteSupermercadoToCiudad should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.string.alpha(12),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        url_web: faker.internet.url(),
      });

    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id is not associated to the ciudad',
    );
  });
});
