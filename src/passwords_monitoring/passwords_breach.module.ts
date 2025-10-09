import { Module } from '@nestjs/common';
import { PasswordsBreachService } from './passwords_breach.service';
import { PasswordsBreachController } from './passwords_breach.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],  // Import HttpModule to make HTTP requests
    providers: [PasswordsBreachService],
    controllers: [PasswordsBreachController],
    exports: [PasswordsBreachService]
})
export class PasswordsModule {}
