import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-jwt";
import {jwtConstant} from "../constant";
import { Request } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-strategy') {
    constructor() {
        super({
            jwtFromRequest: (req: Request) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies['refresh_token'];
                }
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: jwtConstant.rt_secret,
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: any) {
        const refresh_token = req.cookies['refresh_token'];
        if (!refresh_token) {
            throw new UnauthorizedException("Refresh token not found!");
        }
        return { ...payload, refresh_token };
    }
}