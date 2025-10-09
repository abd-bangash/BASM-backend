  /*
    In the context of NestJS, you often use readonly in Data 
    Transfer Objects (DTOs) to ensure that the data
    received in requests is not accidentally modified
    within the application.
    */

  export class ClientDto {
    readonly username: string;
    readonly name: string;
    readonly dateAdded: Date;
    readonly email: string;
    password: string;
    readonly address: string;
    readonly phone : number;
    twoFactorAuthenticationSecret: string;
    readonly hashedRT: string;
    readonly monitoredDomains: string[];
}