import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './booking', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        logoUrl: "https://muslimcouplesretreat.com/assets/images/logo.svg",
        eventName: "Muslim Couple Retreat",
        eventDateRange: "July 19 - 21, 2024",
        slogan: "Love Unlocked: Secrets to a Fulfilling Marriage",
        bannerUrl: "https://devredlimestorage.blob.core.windows.net/muslimcoupleretreat/d12baf0d-5aa0-496a-94c3-1dba81a962ceretreat-banner.jpg",
        bookingAmount: "$2000",
        confirmationCode: "HELLO248D56fDSFDR",
        instructors: [
          {
            "id": 1,
            "name": "Shaykh Yaser Birjas",
            "degree": "Speaker",
            "imageUrl": "https://devredlimestorage.blob.core.windows.net/muslimcoupleretreat/0f7f2673-053a-4ca4-bcbc-f5069f3a095edoctorx.jpg",
            "isActive": true
          }
        ],
        receiver: {
          name: "Rafiul",
          email: "ris.shohan@gmail.com"
        },
        package: {
          roomName: "Villa Bella Vigna",
          packageName: "Vineyard standard room",
          isSinglePackage: "STANDARD" == "STANDARD" ? false : true,
          packagePerson: "COUPLE",
          packagedays: 3,
          packagePrice: "$2800",
          roomFeatures: "Our Vineyard Rooms are large, sun-drenched accommodations offering panoramic views of our working vineyards. These 500-square foot rooms are recently renovated complete with king-sized beds, ensuite bathrooms with large walk-in showers, and wide private balconies.",
          houseFeatures: "Nestled alongside the vineyard, this premier 5 bedroom, 4.5 bath villa has it all, including private swimming pool, gym, chef’s kitchen, two fireplaces as well as indoor and outdoor dining. Address: 136 Via Francesco Florence, TX 76527",
          houseFeatureNote: "This house will be shared by other couples and Staffs",
          packageDealNote: "All meats will be halal for the event.",
          highlightFeatures: [
            { icon: 'icon-bed', label: '1 King Bed' },
            { icon: 'icon-bathroom', label: '1 Attached Bathroom' }
          ],
          packageDeal: [
            { item: '2-Night Stay', child: [], hasChildren: false },
            { item: 'All Activities: Friday – Saturday – Sunday', child: [], hasChildren: false },
            { item: 'Printed in class materials.', child: [], hasChildren: false },
            { item: 'Couples Photo Session', child: [], hasChildren: false },
            {
              item: 'Meals',
              child: [
                'Friday: Welcome Dinner',
                'Saturday: Breakfast, Lunch, and Couples Romantic Dinner',
                'Sunday Breakfast and Lunch',
                'Afternoon Snacks',
                'Hot/Cold drinks throughout the day at the activity center'
              ],
              hasChildren: true
            }
          ],
        }

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
