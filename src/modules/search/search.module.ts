import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { GoogleService } from "src/customService/google.service";

@Module({
    controllers: [SearchController],
    providers: [SearchService, GoogleService]
})
export class SearchModule {
    
}