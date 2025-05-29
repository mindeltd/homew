import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryService } from './services/repository-service.service';
import { Valuation } from './entities/valuation.entity';
import { CacheModule } from '@nestjs/cache-manager';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Company, Valuation],
          synchronize: true,
        }),
        CacheModule.register({
          ttl: 86400,
          isGlobal: false,
        })
      ],
      controllers: [AppController],
      providers: [AppService, RepositoryService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const companiesRepo = moduleFixture.get(RepositoryService).getRepository('companies');
    await companiesRepo.save([
      { name: 'Apple Inc.', ticker: 'AAPL', sector: 'Technology' },
      { name: 'Microsoft Corp.', ticker: 'MSFT', sector: 'Technology' },
    ]);

    const valuationsRepo = moduleFixture.get(RepositoryService).getRepository('valuations');
    await valuationsRepo.save([
      { ticker: 'AAPL', market_cap: 2500000, enterprise_value: 2600000 },
      { ticker: 'MSFT', market_cap: 2000000, enterprise_value: 2100000 },
      { ticker: 'TSLA', market_cap: 900000, enterprise_value: 1100000 },
    ]);
    
  });

  afterAll(async () => {
    await app.close();
  });

  const validCases = [
    {
      desc: 'should return sector for AAPL',
      query: { ticker: 'AAPL', column: 'sector', table: 'companies' },
      expected: { result: 'Technology' },
      status: 200,
    },
    {
      desc: 'should return sector for MSFT',
      query: { ticker: 'MSFT', column: 'sector', table: 'companies' },
      expected: { result: 'Technology' },
      status: 200,
    },
    {
      desc: 'should return sector for AAPL, even when used both low and upper cases',
      query: { ticker: 'aapl', column: 'Sector', table: 'coMPanies' },
      expected: { result: 'Technology' },
      status: 200,
    },
    {
      desc: 'should return market_cap for AAPL',
      query: { ticker: 'AAPL', column: 'market_cap', table: 'valuations' },
      expected: { result: 2500000 },
      status: 200,
    },
    {
      desc: 'should return enterprise_value for MSFT',
      query: { ticker: 'MSFT', column: 'enterprise_value', table: 'valuations' },
      expected: { result: 2100000 },
      status: 200,
    },
    {
      desc: 'should return sector for MSFT, even when used both low and upper cases',
      query: { ticker: 'Msft', column: 'Sector', table: 'Companies' },
      expected: { result: 'Technology' },
      status: 200,
    }
  ];

  const errorCases = [
    {
      desc: 'should return 400 if ticker not found',
      query: { ticker: 'ZZZZ', column: 'sector', table: 'companies' },
      expectedMessage: 'ticker not found',
      status: 400,
    },
    {
      desc: 'should return 400 if column is invalid',
      query: { ticker: 'AAPL', column: 'invalid', table: 'companies' },
      expectedMessage: 'Invalid column',
      status: 400,
    },
    {
      desc: 'should return 400 if table is unknown',
      query: { ticker: 'AAPL', column: 'sector', table: 'unknown' },
      expectedMessage: 'Unknown table: unknown',
      status: 400,
    },
    {
      desc: 'should return 400 if ticker is missing',
      query: { column: 'sector', table: 'companies' },
      expectedMessage: ["ticker should not be empty", "ticker must be a string"],
      status: 400,
    },
    {
      desc: 'should return 400 if column is missing',
      query: { ticker: 'AAPL', table: 'companies' },
      expectedMessage: ["column should not be empty", "column must be a string"],
      status: 400,
    },
    {
      desc: 'should return 400 if table is missing',
      query: { ticker: 'AAPL', column: 'sector' },
      expectedMessage: ["table should not be empty", "table must be a string"],
      status: 400,
    },
    {
      desc: 'should return 400 if column is non-existent',
      query: { ticker: 'AAPL', column: 'nonexistent', table: 'valuations' },
      expectedMessage: 'Invalid column',
      status: 400,
    }
  ];

  validCases.forEach(({ desc, query, expected, status }) => {
    it(desc, async () => {
      const res = await request(app.getHttpServer())
        .get('/query')
        .query(query)
        .expect(status);

      expect(res.body).toEqual(expected);
    });
  });

  errorCases.forEach(({ desc, query, expectedMessage, status }) => {
    it(desc, async () => {
      const res = await request(app.getHttpServer())
        .get('/query')
        .query(query)
        .expect(status);

      expect(res.body.message).toStrictEqual(expectedMessage);
    });
  });
});