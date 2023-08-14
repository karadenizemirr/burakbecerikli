import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuid4} from 'uuid'

@Entity()
export class TaskModel {
    @PrimaryGeneratedColumn('uuid')
    id:string = uuid4()

    @Column()
    name:string

    @Column({default: true})
    status: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
    
}