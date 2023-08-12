import { Injectable } from "@nestjs/common";
import { GoogleService } from "src/customService/google.service";
import { AppDataSource } from "src/customService/mysql.service";
import { SearchModel } from "src/models/search.model";
import { countryType } from "src/types/country.type";

@Injectable()
export class SearchService {
    private country_data:any
    private searchRepository:any

    constructor(private googleService: GoogleService) {
        this.country_data = countryType[0].data
        this.searchRepository = AppDataSource.getRepository(SearchModel)
    }

    async get_search(data:any){
        const keywords = String(data.keywords).split(',')
        const return_data = []

        for (const keyword of keywords){
            const k = String(data?.city).toLowerCase() +' '+ String(data?.district).toLowerCase()+' '+ String(keyword).toLowerCase()
            if (data.city !== 'all' && data.district !== 'all'){
                const r = await this.googleService.maps_scraper(k)
                return_data.push(...r)
            }else if (data.city !== 'all' && data.district === 'all'){
                const city_in_district = await this.get_only_city_only_district(data?.city)
                const districts = city_in_district[0]?.ilceler

                for (const district of districts){
                    const k = String(data?.city).toLowerCase() +' '+ String(district.ilce_adi).toLowerCase()+' '+ String(keyword).toLowerCase()
                    const r = await this.googleService.maps_scraper(k)
                    return_data.push(...r)
                }
                
            }
        }

        return return_data
    }

    async get_all_city(){

    }

    async get_all_district(){

    }

    private async get_only_city_only_district(city:string){
        try{

            let filtred_data = this.country_data.filter(function(item: any){
                return item.il_adi === city
            })

            return filtred_data

        }catch(err){
            throw new Error('Get only city only district error')
        }
    }


    async get_all_data(){
       try{
        return await this.searchRepository.find(
            {
                order: {
                    createdAt: 'DESC'
                }
            }
        )
       }catch(err){
        return;
       } 
    }

}