import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RepositoryService } from './services/repository-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';  // Correct

@Injectable()
export class AppService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly repositoryService: RepositoryService,
  ) {}

  async queryData(ticker: string, column: string, table: string) {
    const cacheKey = `${table}_${ticker}`;

    let record = await this.cacheManager.get<any>(cacheKey);

    if (!record) {
      console.log('no record, gonna cache');
      const repo = this.repositoryService.getRepository(table);
      record = await repo.findOneBy({ ticker });

      if (!record) throw new BadRequestException('ticker not found');

      await this.cacheManager.set(cacheKey, record);
    }

    if (!(column in record)) {
      throw new BadRequestException('Invalid column');
    }

    return record[column];
  }
}
