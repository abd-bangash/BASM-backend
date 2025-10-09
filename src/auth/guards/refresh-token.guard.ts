import {AuthGuard} from "@nestjs/passport";

export class RefreshTokenGuard extends AuthGuard('rt-strategy') {
    constructor() {
        super();
    }
}