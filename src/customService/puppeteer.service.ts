import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import puppeteer from "puppeteer-extra";

@Injectable()
export class PuppeteerService {
    constructor(private configService: ConfigService) {}

    async GET(){

        try{
            const browser = await puppeteer.launch(
                {
                    headless: true,
                    args: [
                        '--no-sandbox', // Güvenlik nedeniyle --no-sandbox argümanını kullanın
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        `--proxy-server=${this.configService.get<string>('PROXY_SERVER')}`
                    ]
                }
            )
            
            return browser

        }catch(err){
            throw new Error('Get request error')
        }
    }
}