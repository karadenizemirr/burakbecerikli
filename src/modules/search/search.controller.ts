import { Body, Controller, Get, Post, Render, Res, UseGuards } from "@nestjs/common";
import { countryType } from "src/types/country.type";
import { SearchService } from "./search.service";
import { AuthGuard } from "src/auth/auth.guard";
import {FastifyReply} from 'fastify'
import { TaskService } from "../task/task.service";
@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {

    constructor(private searchService: SearchService) {}

    @Get()
    @Render('search')
    async get_search(){
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
        return await this.searchService.get_search(bodyData)
    }

    @Get('getAllData')
    async getAllData(){
        const data = await this.searchService.get_all_data()

        return {data}
    }

    @Get('deleteAll')
    async deleteAll(@Res() res:FastifyReply){
        try{
            await this.searchService.delete_all_data()

            return res.status(200).send({success: true})

        }catch(err){
            return res.status(500)
        }
    }
}