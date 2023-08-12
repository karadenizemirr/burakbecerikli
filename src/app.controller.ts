import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('home')
  getHello() {
    return {
      title: "Anasayfa"
    }
  }

  @Get('result')
  @Render('result')
  @UseGuards(AuthGuard)
  getResult() {
    return {
      title: "Veri Deposu"
    }
  }
}
