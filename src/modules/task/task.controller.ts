import { Controller, Get, Render } from "@nestjs/common";
import { TaskService } from "./task.service";

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    async get(){
        const data = await this.taskService.get_all_task()
        return {
            data:data
        }
    }
}