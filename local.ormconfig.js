module.exports = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'my_user',
  password: 'my_password',
  database: 'postgres',
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  entities: ['src/entities/**/*{.ts,.js}']
};
