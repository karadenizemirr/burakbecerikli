import { Injectable } from "@nestjs/common";
import { AppDataSource } from "src/customService/mysql.service";
import { TaskModel } from "src/models/task.model";

@Injectable()
export class TaskService {
    private taskRepository:any
    constructor() {
        this.taskRepository = AppDataSource.getRepository(TaskModel)
    }

    async create_task(keyword:string){
        try{

            const task = new TaskModel()
            task.name = keyword

            await this.taskRepository.save(task)

            return {
                task: true
            }

        }catch(err){
            return;
        }
    }

    async delete_task(){
        try{
            await this.taskRepository.delete({})
        }catch(err){
            return;
        }
    }

    async get_all_task(){
        try{
            
            return await this.taskRepository.find()

        }catch(err){
            return;
        }
    }
}