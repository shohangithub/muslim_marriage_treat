import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './booking', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.firstName,
        url,
      },
    });
  }

  async sendEmailwithTemplate(
    emailAddress: string,
    templateUrl: string,
    subject?: string,
    context?: any,
  ) {
    await this.mailerService.sendMail({
      to: emailAddress,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: templateUrl, // `.hbs` extension is appended automatically
      context: context,
    });
  }
}
