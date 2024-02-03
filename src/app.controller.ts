import { Body, Controller, ForbiddenException, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('webhook')
  verifyWebHook(@Query('hub.verify_token') token: any, @Query('hub.challenge') challenge: any) {
    console.log(token, challenge);
    if (token === process.env.WEBHOOK_TOKEN) {
      console.log('Webhook Is Matched');

      return challenge;
    } else {
      console.log('token mismatched!');
      throw new ForbiddenException('Mismatched Webhook Token');
    }
  }
  @Post('webhook')
  checkPageSubscription(@Body() body: any) {
    if (body.object === 'page') {
      let client: string;
      body.entry.forEach((element: any) => {
        console.log(element);
        client = element.messaging[0].sender.id;
        console.log(client, element.messaging);
        axios
          .post(
            `https://graph.facebook.com/v19.0/me/custom_user_settings?access_token=${process.env.APP_KEY}`,
            {
              psid: client,
              persistent_menu: [
                {
                  locale: 'default',
                  composer_input_disabled: false,
                  call_to_actions: [
                    {
                      type: 'postback',
                      title: 'Talk to an agent',
                      payload: 'CARE_HELP',
                    },
                    {
                      type: 'postback',
                      title: 'Outfit suggestions',
                      payload: 'help',
                    },
                    {
                      type: 'web_url',
                      title: 'Shop now',
                      url: 'https://www.originalcoastclothing.com/',
                      webview_height_ratio: 'full',
                    },
                  ],
                },
              ],
            },
          )
          .catch((err) => console.log(err.response));
      });
      this.appService.sendCustomerMessage(
        client,
        'STFU',
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3f8dc8d4-18f3-4758-8b28-9cbe4ac51adc/ddm661g-8519299f-49fe-49a0-8bca-08e9bf0e9e83.jpg/v1/fill/w_600,h_710,q_75,strp/hazbin_hotel_charlie_by_denii_art13_ddm661g-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzEwIiwicGF0aCI6IlwvZlwvM2Y4ZGM4ZDQtMThmMy00NzU4LThiMjgtOWNiZTRhYzUxYWRjXC9kZG02NjFnLTg1MTkyOTlmLTQ5ZmUtNDlhMC04YmNhLTA4ZTliZjBlOWU4My5qcGciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.3RQ8xNb6FFOC6nnuiQUnftsK8QLFARrRjN7S4k8lkkI',
      );
    }
    return 'OK';
  }
}
