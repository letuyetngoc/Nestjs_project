import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "letuyetngocksh@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'job', // HTML body content
    });

  }
}
