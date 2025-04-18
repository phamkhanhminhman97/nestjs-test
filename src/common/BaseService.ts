import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class BaseService<T> extends TypeOrmCrudService<T> {
  async getManyMe(req, userId) {
    const { parsed, options } = req;
    let builder = await this.createBuilder(parsed, options);
    builder = builder.andWhere({ customerId: userId });
    return this.doGetMany(builder, parsed, options);
  }
}
