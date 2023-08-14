import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { GoogleService } from "src/customService/google.service";
import { TaskService } from "../task/task.service";

@Module({
    controllers: [SearchController],
    providers: [SearchService, GoogleService, TaskService]
})
export class SearchModule {
    
}