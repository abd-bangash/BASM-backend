import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TrainingTokenGuard extends AuthGuard('training') {}
