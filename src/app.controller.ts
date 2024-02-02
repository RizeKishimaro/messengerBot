import { Body, Controller, ForbiddenException, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('webhook')
  verifyWebHook(@Query('hub.verify_token') token: any, @Query("hub.challenge") challenge:any){
    console.log(token, challenge)
    if(token === process.env.WEBHOOK_TOKEN){
      console.log("Webhook Is Matched")
      return challenge
    }else{
      console.log('token mismatched!')
      throw new ForbiddenException("Mismatched Webhook Token")
    } 
  }
  @Post("webhook")
  checkPageSubscription(@Body() body: any){
  console.dir(body.entry[0].messaging);
   if(body.object === "page"){
      body.entry.forEach(element => {
        
      });
    }
    return "OK"
  }
}
