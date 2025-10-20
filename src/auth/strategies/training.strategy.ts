import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstant } from '../constant';

@Injectable()
export class TrainingStrategy extends PassportStrategy(Strategy, 'training') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.training_secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, campaignId: payload.campaignId };
  }
}
