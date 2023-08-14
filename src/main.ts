import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import { AppDataSource } from './customService/mysql.service';
import secureSession from '@fastify/secure-session';
import * as crypto from 'crypto'
import { GlobalExceptionFilter } from './customService/notfound.service';
import handlebars from 'handlebars';
import fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  AppDataSource.initialize().then(() => console.log('Database connect success')).catch((err) => console.log('Database connect not success'))

  app.useStaticAssets({
    root: join(__dirname, '..', 'src/static/assets'),
    prefix: '/assets/',
  });

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'src/static/views'),
    layout: 'layout/main',

  });
  const partialContent = fs.readFileSync(join(__dirname, '..', 'src/static/views/partials/task.hbs'), 'utf-8');
  handlebars.registerPartial('task', partialContent);
  
  const key = crypto.randomBytes(32)
  
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    key: key,
    cookieName: 'session',
    cookie: {
      secure: true,
      expires: new Date(Date.now() + 3600000),
      path: '/'
    },

  });
  app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(process.env.PORT ?? 3000, process.env.HOST || '0.0.0.0');
}
bootstrap();