import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClientSchema } from "../database/schemas/client.schema";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      MongooseModule.forFeature([{name: "ClientsCollection", schema: ClientSchema}])
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule{}