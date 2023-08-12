import { Body, Controller, Get, Post, Render, UseGuards } from "@nestjs/common";
import { countryType } from "src/types/country.type";
import { SearchService } from "./search.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {

    constructor(private searchService: SearchService) {}

    @Get()
    @Render('search')
    get_search(){

        return {
            title: 'Arama Yap',
            data:countryType[0].data
        }
    }

    @Get('countryData')
    async get_country_data(){
        return {
            data:countryType[0].data
        }
    }

    @Post()
    async post_search(@Body() bodyData:any){
        return this.searchService.get_search(bodyData)
    }

    @Get('getAllData')
    async getAllData(){
        const data = await this.searchService.get_all_data()

        return {data}
    }
}