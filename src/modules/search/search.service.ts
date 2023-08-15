import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GoogleService } from "src/customService/google.service";
import { AppDataSource } from "src/customService/mysql.service";
import { SearchModel } from "src/models/search.model";
import { TaskModel } from "src/models/task.model";
import { countryType } from "src/types/country.type";
import { TaskService } from "../task/task.service";

@Injectable()
export class SearchService {
    private country_data:any
    private searchRepository:any

    constructor(private googleService: GoogleService, private taskService: TaskService) {
        this.country_data = countryType[0].data
        this.searchRepository = AppDataSource.getRepository(SearchModel)
        
    }

    async get_search(data:any){
        try{
            const keywords = String(data.keywords).split(',')
            const return_data = []

            const timeout = (ms:number) => {
                return new Promise((resolve) => setTimeout(resolve, ms))
            }

            for (const keyword of keywords){
                const k = String(data?.city).toLowerCase() +' '+ String(data?.district).toLowerCase()+' '+ String(keyword).toLowerCase()
                // Create Task
                const task = await this.taskService.create_task(keyword)
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

            const result = await Promise.race([Promise.all(return_data), timeout(5000)])
            if (!result){
                await this.taskService.delete_task()
                return return_data
            }
            if (return_data.length > 0){
                // Tasks End
                await this.taskService.delete_task()
            }
    
            return return_data
        }catch(err){
            await this.taskService.delete_task()
        }
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

    async delete_all_data(){
        try{

            await this.searchRepository.delete({})

        }catch(err){
            throw new HttpException('Delete all error', HttpStatus.BAD_REQUEST)
        }
    }

}