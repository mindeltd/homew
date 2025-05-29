import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'companies'})
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    ticker: string;

    @Column()
    sector: string;
}
