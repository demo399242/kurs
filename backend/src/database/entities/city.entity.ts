import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm'
import { Region } from './region.entity';
import { Shop } from './shop.entity';

@Entity()
export class City {

  // Идентификатор города
  @PrimaryColumn()
  id: number;

  // Наименование 
  @Column({ length: 50 })
  name: string;

  // Наименование RUSSIA
  @Column({ length: 50 })
  name_russia: string;

  // Наименование KZ
  @Column({ length: 50 })
  kzname: string;

  // Статус (1, 2, 3, 4)
  @Column('tinyint')
  status: number;

  // Население
  @Column()
  population: number;

  // Регион
  @ManyToOne(type => Region, region => region.cities, { nullable: false, onDelete: 'CASCADE' })
  region: Region;

  // Регион2
  @ManyToOne(type => Region, region => region.cities2, { nullable: true, onDelete: 'CASCADE' })
  region2: Region;

  // Обменники
  @OneToMany(type => Shop, shop => shop.city)
  shops: Shop[];
  
}
