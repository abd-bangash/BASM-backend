import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({

            service: 'gmail', // or use smtp
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),  // e.g. "yourapp@gmail.com"
                pass: this.configService.get<string>('EMAIL_PASS')   // app password (not your actual Gmail password)
            }
        });
    }

    async sendVideoLink(to: string, category: string, link: string) {
        console.log(this.configService.get<string>('EMAIL_USER'));
        const mailOptions = {
            from: `"Tabletop Training" <${this.configService.get<string>('EMAIL_USER')}>`,
            to,
            subject: `Watch Video for Weak Category: ${category}`,
            html: `
        <p>Dear User,</p>
        <p>You scored below 80% in <b>${category}</b>.</p>
        <p>Please watch the assigned training video to improve.</p>
        <a href="${link}" style="color:blue;">Click here to watch the video</a>
        <p>After watching, you’ll be retested on the same questions.</p>
      `
        };

        await this.transporter.sendMail(mailOptions);
    }
}
