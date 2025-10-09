import {Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query, Res, HttpStatus} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { Client } from "../database/schemas/client.schema";
import { ClientDto } from "../database/dto/client.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import {ObjectId} from "mongoose";
import {Public} from "../common/decorators";

//high-level controller for clients
@Controller('clients')
export class ClientsController{
    constructor(private readonly clientsService: ClientsService){}
    //fetch all clients
    @Get()
    async findAll(): Promise<Client[]>{
        return this.clientsService.findAll();
    }
    //POST /clients
    @Post('create-client')
    async createClient(@Body() newClient: ClientDto): Promise<Client> {
      const createdClient = await this.clientsService.createClient(newClient);
      console.log(createdClient);
      return createdClient;
    }

    @Get('client-by-username/:username')
    async getClientName(@Param('username') username: string): Promise<{ _id: ObjectId, name: string, dateAdded: Date }>{
        console.log("Got username: ", username);
        return this.clientsService.getClientByUsername(username);
    }

    /*
    Gets all the organizations that are our client
     */
    @Get('organizations')
    async getAllOrganizations(): Promise<string[]>{
        return this.clientsService.getAllOrganizations();
    }

    @Get('id/:id')
    //route handler param decorator
    async getOneClient(@Param('id') id: string): Promise<Client> {
    return this.clientsService.findOne(id);
    }

    // Get monitored domains of a client (Dark web)
    @Public()
    @Get('monitored-domains/:username')
    async getMonitoredDomains(@Param('username') username: string, @Res() res) {
        const response = await this.clientsService.getMonitoredDomains(username);
        if (response === null) {
            res.status(HttpStatus.NOT_FOUND).send();
        } else {
            res.status(HttpStatus.OK).send({domain: response});
        }
    }

    //PUT /clients/:id
    @Put('update/:id')
    async updateClient(@Param('id') id: string, @Body() updateClientDto: ClientDto): Promise<Client> {

        return this.clientsService.updateClient(id, updateClientDto);
    }
    //DELETE /clients/:id
    @Delete('remove/:id')
    async removeClient(@Param('id') id: string): Promise<Client> {
    return this.clientsService.removeClient(id);
      
    }
}