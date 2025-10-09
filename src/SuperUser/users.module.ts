import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperUserSchema } from 'src/database/schemas/super_user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'SuperCollections', schema: SuperUserSchema}])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
