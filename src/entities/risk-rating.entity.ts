import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('risk_ratings')
export class RiskRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column('float')
  volatility_score: number;

  @Column({ nullable: true })
  credit_rating: string;

  @Column('float', { nullable: true })
  liquidity_score: number;
}