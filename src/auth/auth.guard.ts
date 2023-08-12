import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { JwtService } from "src/customService/jwt.service";
import {secureSession} from 'fastify-secure-session'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.session as secureSession.session

        if (token && token['token']){
            return true
        }

        return false

    }

}