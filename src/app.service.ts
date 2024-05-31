import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async sendEmail() {
    const token = Math.floor(1000 + Math.random() * 9000).toString();

    const user: User = {
      id: 1,
      firstName: 'Rafiul Islam',
      lastName: 'shohan',
      email: 'sohan@redlimesolutions.com',
      phone: '01854263181',
      password: '',
      isActive: true,
    };
    // create user in db
    // ...
    // send confirmation mail
    await this.mailService.sendUserConfirmation(user, token);
  }
}
