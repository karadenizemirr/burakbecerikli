import { Body, Controller, Get, Post, Res, Session } from "@nestjs/common";
import { UserService } from "./user.service";
import * as secureSession from '@fastify/secure-session'
import {FastifyReply} from 'fastify'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('login')
    async login(@Body() bodyData:any, @Session() session:secureSession.Session, @Res() res:FastifyReply){
        // Login Operations
        const login:any = await this.userService.login(bodyData?.username, bodyData?.password);

        if (login.token){
            session.set('token', login.token)
            
            res.redirect(302, '/')
        }
        
        return {
            token: null,
            message: 'login not success'
        }
        
    }


    @Get('logout')
    async logout(@Res() res:FastifyReply, @Session() session:secureSession.Session){
        session.delete()
        res.redirect(302, '/')
    }
}