import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SearchModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    address : string;

    @Column({nullable: true})
    phone_number: string

    @Column({nullable: true})
    website: string

    @Column({length: 500})
    link: string

    @Column({nullable: true})
    rate: string

    @Column({nullable:true})
    category: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}