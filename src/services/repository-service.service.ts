import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { entityMap } from '../app.module';

@Injectable()
export class RepositoryService {

  constructor(private readonly dataSource: DataSource) {}

  getRepository(tableName: string): Repository<any> {
    const entity = entityMap[tableName];
    if (!entity) {
      throw new BadRequestException(`Unknown table: ${tableName}`);
    }
    return this.dataSource.getRepository(entity);
  }
}