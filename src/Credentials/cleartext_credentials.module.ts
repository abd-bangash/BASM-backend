import { Module } from '@nestjs/common';
import { CleartextCredentialsService } from './cleartext_credentials.service';
import { CleartextCredentialsController } from './cleartext_credentials.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule], // Importing HttpModule to make HTTP requests
    controllers: [CleartextCredentialsController],
    exports: [CleartextCredentialsService],
    providers: [CleartextCredentialsService],
})
export class CleartextModule {}
