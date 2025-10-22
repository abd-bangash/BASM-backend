import { NestFactory, Reflector } from '@nestjs/core'; // 👈 Import Reflector
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'; // 👈 Correct path to your guard

async function bootstrap() {
  const ENVIRONMENT = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  let app!: INestApplication<any>;

  if (ENVIRONMENT === 'production') {
    console.log('inside production branch');
    const httpsOptions = {
      key: fs.readFileSync('/etc/ssl/basmai-private/server.key'),
      cert: fs.readFileSync('/etc/ssl/basmai/basm_ai_net.pem'),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }

  console.log(` Running in ${ENVIRONMENT} environment.`);

  app.use(cookieParser());

  // ✅ ADD THIS CODE BELOW:
  const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector)); // 👈 this line is crucial

  if (ENVIRONMENT === 'development') {
    console.log(' Swagger enabled on /api endpoint!');
    const config = new DocumentBuilder()
      .setTitle('Mithril API')
      .setDescription('The Mithril BAS API description')
      .setVersion('0.3.2')
      .addTag('breach and attack simulation')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'http://192.168.1.114:4200',
      'https://basmai.net'
    ],
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API running in ${ENVIRONMENT} on port ${PORT}`);
  });
}

bootstrap();
