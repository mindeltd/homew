import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { Company } from './entities/company.entity';
import { RiskRating } from './entities/risk-rating.entity';
import { Valuation } from './entities/valuation.entity';
import { RepositoryService } from './services/repository-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.NODE_ENV === 'local-docker' ? 'db' : 'localhost',
        port: parseInt(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: getEntities(),
        synchronize: true
      }),
    }),

    CacheModule.register({
      ttl: 86400, // 24 hours
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RepositoryService],
})
export class AppModule {}

export const getEntities = (): any[] => Object.values(entityMap);

export const entityMap: Record<string, any> = {
  companies: Company,
  risk_ratings: RiskRating,
  valuations: Valuation,
};