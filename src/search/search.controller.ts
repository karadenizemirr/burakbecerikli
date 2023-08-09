import { Controller, Get, Render } from "@nestjs/common";
import { countryType } from "src/types/country.type";

@Controller('search')
export class SearchController {

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
}