/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CiudadModule } from './ciudad/ciudad.module';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoModule } from './ciudad-supermercado/ciudad-supermercado.module';
import { CiudadEntity } from './ciudad/ciudad.entity/ciudad.entity';
import { SupermercadoEntity } from './supermercado/supermercado.entity/supermercado.entity';

@Module({
  imports: [
    CiudadModule,
    SupermercadoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [CiudadEntity, SupermercadoEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CiudadSupermercadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
