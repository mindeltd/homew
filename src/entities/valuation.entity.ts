import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('valuations')
export class Valuation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column('float')
  market_cap: number;

  @Column('float', { nullable: true })
  enterprise_value: number;
}