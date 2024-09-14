/* eslint-disable prettier/prettier */
import { CiudadEntity } from '../../ciudad/ciudad.entity/ciudad.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 6 })
  longitud: number;

  @Column('decimal', { precision: 10, scale: 6 })
  latitud: number;

  @Column()
  url_web: string;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermercados)
  @JoinTable()
  ciudades: CiudadEntity[];
}
