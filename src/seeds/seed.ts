import { Valuation } from '../entities/valuation.entity';
import { Company } from '../entities/company.entity';
import { RiskRating } from '../entities/risk-rating.entity';
import { DataSource } from 'typeorm';

import { config } from 'dotenv';
import { getEntities } from '../app.module';

async function seed() {
  config();

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.NODE_ENV === 'local-docker' ? 'db' : 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: getEntities(),
    synchronize: true,
  });

  await dataSource.initialize();

  const companyRepo = dataSource.getRepository(Company);
  const riskRatingRepo = dataSource.getRepository(RiskRating);
  const valuationRepo = dataSource.getRepository(Valuation);

  try {
    await companyRepo.save([
      {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        sector: 'Technology',
      },
      {
        name: 'Microsoft Corporation',
        ticker: 'MSFT',
        sector: 'Technology',
      },
      {
        name: 'JPMorgan Chase & Co.',
        ticker: 'JPM',
        sector: 'Financials',
      },
    ]);
    console.log('Companies seeded');
  } catch (error) {
    console.log('Companies were already seeded');
  }

  try {
    await riskRatingRepo.save([
      {
        ticker: 'AAPL',
        volatility_score: 0.23,
        credit_rating: 'AA+',
        liquidity_score: 95,
      },
      {
        ticker: 'MSFT',
        volatility_score: 0.19,
        credit_rating: 'AAA',
        liquidity_score: 97,
      },
      {
        ticker: 'JPM',
        volatility_score: 0.28,
        credit_rating: 'A+',
        liquidity_score: 89,
      },
    ]);
    console.log('Risk ratings seeded');
  } catch (error) {
    console.log('Risk ratings were already seeded');
  }

  try {
    await valuationRepo.save([
      { ticker: 'AAPL', market_cap: 2500000000000, enterprise_value: 2600000000000 },
      { ticker: 'MSFT', market_cap: 2300000000000, enterprise_value: 2400000000000 },
      { ticker: 'JPM', market_cap: 400000000000, enterprise_value: 420000000000 },
    ]);
    console.log('Valuations seeded');
  } catch (error) {
    console.log('Valuations were already seeded');
  }

  console.log('Seeding process completed (with possible warnings)');
  process.exit(0);
}

seed();