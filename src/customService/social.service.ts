import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SocialService {
  constructor() {}

  async get_social(text:string){
    try{

      const options = {
        method: 'GET',
        url: 'https://social-links-search.p.rapidapi.com/search-social-links',
        params: {
          query: text,
          social_networks: 'instagram'
        },
        headers: {
          'X-RapidAPI-Key': '507e4109a3msh25f08b98981bc80p1c4617jsn1377f3c2656d',
          'X-RapidAPI-Host': 'social-links-search.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      const data = response.data

      if (data.status === 'OK'){
        return data
      }else {
        return null
      }
    }catch(err){
      return null
    }
  }

}
