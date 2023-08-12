import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
    constructor() {}
    private readonly secretKey = "burakbecerikli"

    generateToken(payload:any):string {
        return jwt.sign(payload, this.secretKey)
    }

    verifyToken(token:string):any{
        return jwt.verify(token, this.secretKey)
    }
}