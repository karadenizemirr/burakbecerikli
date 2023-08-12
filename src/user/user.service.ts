import { Injectable } from "@nestjs/common";
import { JwtService } from "src/customService/jwt.service";
import { AppDataSource } from "src/customService/mysql.service";
import { UserModel } from "src/models/user.model";

@Injectable()
export class UserService {
    private userRepository:any
    constructor(private jwtService: JwtService) {
        this.userRepository = AppDataSource.getRepository(UserModel)
    }

    async login(username:string, password:string){
        try{


            const control =  await this.userRepository.findOne(
                {
                    where: {
                        username: username
                    }
                }
            )

            if (control){
                // login success
                if (control.password === password){
                    const token = this.jwtService.generateToken({
                        username: control.username
                    })

                    return {
                        token: token
                    }
                }
            }


        }catch(err){
            return;
        }
    }

    async logout(){

    }

    async register(){
        
    }
}