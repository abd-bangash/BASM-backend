import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Client } from '../database/schemas/client.schema';

import * as bcrypt from 'bcrypt';
import { ClientDto } from "../database/dto/client.dto";
import { authenticator } from "otplib";

@Injectable()

export class ClientsService {
  constructor(
    @InjectModel("ClientsCollection") private clientModel: Model<Client>
  ) { }

  async createClient(createClientDto: ClientDto) {
    const saltedRounds = 12;
    const hashedPassword = await bcrypt.hash(createClientDto.password, saltedRounds);
    // Generate the 2FA secret key

    createClientDto['twoFactorAuthenticationSecret'] = authenticator.generateSecret();
    createClientDto.password = hashedPassword;
    const createdClient = new this.clientModel(createClientDto);
    return createdClient.save();
  }

  async getClientByUsername(username: string): Promise<{ _id: ObjectId, name: string, dateAdded: Date }> {
    const client = await this.clientModel.findOne({ username }).exec();
    console.log("Got client by username request!");
    return { _id: client.id, name: client.name, dateAdded: client.dateAdded };
  }


  async getAllOrganizations() {
    const clients = await this.clientModel.find({}).select('name -_id').exec();
    return Array.from(new Set(clients.map(data => data.name)));
  }

  async getClientPasswordByUsername(username: string) {
    const client = await this.clientModel.findOne({ username }).exec();
    // console.log("Got client by username request!");
    if (!client) return null;
    return client.password;
  }

  async findAll(): Promise<Client[]> {
    return this.clientModel.find().exec();
  }

  async findOne(id: string): Promise<Client> {
    return this.clientModel.findById(id).exec();
  }

  async findClientByEmail(email: string): Promise<Client> {
    const user = await this.clientModel.findOne({ email: email }).lean().exec();
    console.log(user);
    return user;
  }

  async updateClient(id: string, data: any): Promise<Client> {
    return this.clientModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async updateClientByUsername(username: string, data: any) {
    return this.clientModel.updateOne({ username }, data).exec();
  }

  async removeClient(id: string): Promise<Client> {
    return this.clientModel.findByIdAndDelete(id).lean().exec();
  }

  // Update the refresh token of user
  async updateClientRt(id: string, data: string) {
    let mongoose_id: mongoose.Types.ObjectId;
    try {
      mongoose_id = new mongoose.Types.ObjectId(id);
      return this.clientModel.findByIdAndUpdate(mongoose_id, { hashedRT: data });
    }
    catch (e) {
      console.log("Error updating refresh token of user ", id);
      console.error(e);
    }
  }

  async getMonitoredDomains(username: string) {
    console.log("In client monitored domains")
    const client = await this.clientModel.findOne({ username }).exec();
    console.log(client);
    if (!client || client.monitoredDomains.length === 0) return null;
    return client.monitoredDomains;
  }

  async deleteClientRt(username: string) {
    const client = await this.clientModel.findOne({ username }).exec();
    return await this.clientModel.findByIdAndUpdate(client._id, { hashedRT: null }).exec();
  }
}