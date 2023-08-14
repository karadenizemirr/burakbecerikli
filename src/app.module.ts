import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './modules/search/search.module';
import { PuppeteerService } from './customService/puppeteer.service';
import { UserModule } from './user/user.module';
import { JwtService } from './customService/jwt.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptors } from './auth/auth.interceptors';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocialModule } from './modules/social/social.module';
import { TaskModule } from './modules/task/task.module';

@Global()
@Module({
  imports: [
    SearchModule,
    UserModule, 
    ConfigModule.forRoot(
      {isGlobal: true,envFilePath: '.env'}
    ),
    SocialModule,
    TaskModule
  
  ],
  controllers: [AppController],
  providers: [AppService,PuppeteerService, JwtService, {
    provide: APP_INTERCEPTOR,
    useClass:AuthInterceptors
  }],
  exports: [PuppeteerService, JwtService]
})
export class AppModule {}
