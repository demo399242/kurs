import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { City } from './city.entity';

@Entity()
export class Region {

  // Идентификатор города
  @PrimaryColumn()
  id: number;

  // Наименование 
  @Column({ length: 50 })
  name: string;

  @Column()
  isCity: boolean;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Relations
  // - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Города
  @OneToMany(type => City, city => city.region)
  cities: City[];

  // Города2
  @OneToMany(type => City, city => city.region2)
  cities2: City[];

}

