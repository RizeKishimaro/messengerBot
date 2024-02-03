import { Injectable, OnModuleInit } from '@nestjs/common';
import * as facebook from 'fb-messenger-bot-api';
import axios from 'axios';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {}
  onModuleInit() {
    this.getHello();
  }
  getHello(): any {
    const messageClient = new facebook.FacebookMessagingAPIClient(process.env.APP_KEY);
    return 'Hello World!';
  }
  async sendCustomerMessage(recipientId: string, message?: string, attachments?: string) {
    await axios
      .post(`https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.APP_KEY}`, {
        recipient: {
          id: recipientId,
        },
        message: {
          attachment: {
            type: 'image',
            payload: {
              url: attachments,
              is_reusable: true,
            },
          },
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
