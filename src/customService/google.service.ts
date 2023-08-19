import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { AppDataSource } from "./mysql.service";
import { SearchModel } from "src/models/search.model";
import { ConfigService } from "@nestjs/config";
import { SocialService } from "./social.service";

@Injectable()
export class GoogleService {
    private base_url: any
    private searchRepository = AppDataSource.getRepository(SearchModel)
    constructor(private puppeteerService: PuppeteerService, private configService: ConfigService, private socialService: SocialService) {
        this.base_url = "https://www.google.com/maps/?q="
    }

    async maps_scraper(keyword: any) {
        try {
            
            const browser = await this.puppeteerService.GET()
            const page = await browser.newPage()
            await page.authenticate({
                username: this.configService.get<string>('PROXY_USERNAME'),
                password: this.configService.get<string>('PROXY_PASSWORD')
            })
            await page.goto(this.base_url + keyword) // This keywords

            await page.evaluate(() => {
                const element:any = document.querySelector('#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.AIC7ge > div.CxJub > div.VtwTSb > form:nth-child(2) > div > div > button')
                if (element){
                    element.click()
                }
            })
            const scroll_container = ".m6QErb[aria-label]"
            await page.waitForSelector(scroll_container)

            while (true){
                await this.scrollPage(page, scroll_container)
                
                const end_element = await page.$('span.HlvSq')

                if (end_element){
                    console.log('End data')
                    break;
                }
            }
            
            const links = await this.get_a_tag(page)
            const result = []

            for (const link of links){
                result.push(await this.get_data(link,page,keyword))
            }
            await browser.close()

            return result

        } catch (err) {
            throw new HttpException('Error google scraping', HttpStatus.FAILED_DEPENDENCY)
        }
    }


    private async scrollPage(page: any, scrollContainer: string) {
        let lastHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);
        while (true) {
            await page.evaluate(`document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`);
            await page.waitForSelector(scrollContainer)
            let newHeight = await page.evaluate(`document.querySelector("${scrollContainer}").scrollHeight`);

            if (newHeight === lastHeight) {
                break;
            }

            lastHeight = newHeight;
        }
        
        console.log(lastHeight)
        return lastHeight
    }

    private async get_a_tag(page:any){
        try{
            
            const a = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a')).map((el) => el.href)
                    .filter((link:string) => 
                        link.match(/https:\/\/www.google.com\/maps\//g) &&
                        !link.match(/\=https:\/\/www.google.com\/maps\//g)
                    )

            });
            
            return a
        }catch(err){
            throw new HttpException('Parse error', HttpStatus.FAILED_DEPENDENCY)
        }
    }

    private async get_data(link:any,page:any,category?:string){
        try{

            // Open Link
            await page.goto(link)
            // TODO: Sosyal medya linkleri alınacak
            const data = await page.evaluate((link:string) => {
                var element = Array.from(document.querySelectorAll('.kR99db')).map((el:any) => el.innerText)
                var phone_number = element.filter((item:string) => item.match(/((\+|00)?90\s?)?((\(?\d{3}\)?)|(\d{3}))?\s?\d{3}\s?\d{2}\s?\d{2}(\s?-\s?\d{2})?/))
                var website = element.filter((item:string) => item.match(/\b[a-zA-Z0-9-]+\.(com|com\.tr|net|org|edu|gov|mil|co|io|xyz|info)\b/))
                return {
                    name: document.querySelector('h1.lfPIob')?.textContent,
                    address: String(element[0]).replace('Турска', 'Türkiye').replace('Turquía', 'Türkiye').replace('Turquia', 'Türkiye'),
                    website: website[0] || null,
                    phone_number : phone_number[0] || null,
                    rate: document.querySelector('#QA0Szd > div > div > div.w6VYqd > div:nth-child(2) > div > div.e07Vkf.kA9KIf > div > div > div.TIHn2 > div > div.lMbq3e > div.LBgpqf > div > div.fontBodyMedium.dmRWX > div.F7nice > span:nth-child(2) > span > span')?.textContent,
                    link: link
                }
            }, link)

            const control = await this.searchRepository.findOne(
                {
                    where: {
                        name: data.name
                    }
                }
            )

            if (!control && data.phone_number){
                data.category = category.toUpperCase()
                // Get Social Media
                const social = await this.socialService.get_social(data.name)
                data.instagram = await social?.data?.instagram[0] || null
                await this.searchRepository.save(data)
            }
            return data

        }catch(err){
            throw new HttpException('Error google scraping', HttpStatus.FAILED_DEPENDENCY)
        }
    }
}