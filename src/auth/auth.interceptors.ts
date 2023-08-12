import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { secureSession } from 'fastify-secure-session';


@Injectable()
export class AuthInterceptors implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const token = request.session as secureSession

        let isLogin = false

        if (token && token['token']){
            isLogin = true
        }

        response.locals.isLogin = isLogin
        
        return next.handle()
    }
}