/* eslint-disable prettier/prettier */
import { SupermercadoEntity } from '../../supermercado/supermercado.entity/supermercado.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  pais: string;

  @Column()
  num_habitantes: number;

  @ManyToMany(() => SupermercadoEntity, (supermercado) => supermercado.ciudades)
  supermercados: SupermercadoEntity[];
}
