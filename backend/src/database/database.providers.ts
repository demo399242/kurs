import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// export const typeOrmModuleOptions: TypeOrmModuleOptions = {
//   type: "sqlite",
//   database: __dirname+'/line.sqlite',
//   entities: [
//     __dirname + '/../**/*.entity{.ts,.js}',
//   ],
//   synchronize: true,   
//   logging: true,
// };

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'mariadb', //'localhost',
  port: 3306,
  username: process.env.MYSQL_USER, //'admin',
  password: process.env.MYSQL_PASSWORD, //'AzAzAz56835683',
  database: process.env.MYSQL_DATABASE, //'kairos',
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true,   
  logging: false,
};