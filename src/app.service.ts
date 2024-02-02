import { Injectable, OnModuleInit } from '@nestjs/common';
import * as facebook from "fb-messenger-bot-api";

@Injectable()
export class AppService implements OnModuleInit{
  constructor(){}
  onModuleInit() {
      this.getHello();
  }
  getHello(): any {
    const messageClient = new facebook.FacebookMessagingAPIClient(process.env.APP_KEY);
    return 'Hello World!';
  }
}
