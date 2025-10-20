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

    async sendTrainingDashboardLink(to: string, token: string, name: string) {
        const frontendUrl = 'http://localhost:4200'; // Replace with your actual frontend URL
        const link = `${frontendUrl}/training?token=${token}`;

        const mailOptions = {
            from: `"BASM AI Tabletop Training" <${this.configService.get<string>('EMAIL_USER')}>`,
            to,
            subject: 'Your BASM AI Tabletop Training Session is Ready',
            html: `
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BASM AI | Tabletop Training</title>
<style>
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }

body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  color: #CCCCCC;
  font-family: 'Arial', sans-serif;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #111111;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.2);
}

.header {
  background-color: #111111;
  padding: 40px 20px 20px;
  text-align: center;
  border-bottom: 1px solid #222222;
}

.branding {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #FF8C00;
  letter-spacing: 3px;
}

.subheader {
  font-size: 16px;
  color: #BBBBBB;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.content-area {
  padding: 40px 30px;
  line-height: 1.7;
  color: #CCCCCC;
}

.greeting {
  font-size: 18px;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.body-text {
  font-size: 16px;
  margin-bottom: 25px;
  color: #CCCCCC;
}

.cta-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #FF8C00;
  color: #111111;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(255, 140, 0, 0.4);
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #ffa733;
}
  a.cta-button, a.cta-button:visited, a.cta-button:hover, a.cta-button:active {
  color: #111111 !important;
  background-color: #FF8C00 !important;
  text-decoration: none !important;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
  padding: 15px 30px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(255, 140, 0, 0.4);
}

a.cta-button:hover {
  background-color: #ffa733 !important;
}

.link-note {
  margin-top: 25px;
  font-size: 13px;
  color: #888888;
  text-align: center;
}

.footer {
  background-color: #000000;
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #555555;
  border-top: 1px solid #222222;
}
</style>
</head>
<body>
<center>
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container">

          <!-- Header -->
          <tr>
            <td class="header">
              <span class="branding">BASM AI</span>
              <div class="subheader">Tabletop Training</div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-area">
              <p class="greeting" style="font-size: 18px; color: #FFFFFF; margin-bottom: 20px;">Dear ${name},</p>
              <p class="body-text" style="font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">
                Your personalized <strong>BASM AI Tabletop Training</strong> session, based on your recent exercise results, is now ready.
              </p>
              <p class="body-text" style="font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">
                This training is designed to help you strengthen your response to key cybersecurity scenarios and enhance your awareness.
              </p>

              <!-- Call to Action -->
             <div style="text-align: center; margin: 40px 0;">
                <a href="${link}" class="cta-button" style="color:#111111 !important; background-color:#FF8C00 !important; text-decoration:none !important; border-radius:8px; font-weight:bold; display:inline-block; padding:15px 30px; font-size:16px; box-shadow:0 4px 10px rgba(255,140,0,0.4);">
                    START YOUR TRAINING NOW
                </a>
            </div>

              <p class="link-note" style="margin-top: 25px; font-size: 13px; color: #888888; text-align: center;">*This personalized link will expire in 24 hours.</p>

              <p class="body-text" style="margin-top: 40px; font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">Thank you for your commitment to improving cybersecurity readiness.</p>
              <p style="color: #CCCCCC;">— The BASM AI Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              &copy; ${new Date().getFullYear()} BASM AI | Tabletop Training. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</center>
</body>
</html>
        `,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendTrainingCompletionEmail(to: string, name: string) {
        const frontendUrl = 'http://localhost:4200'; // Base URL for the dashboard

        const mailOptions = {
            from: `"BASM AI Tabletop Training" <${this.configService.get<string>('EMAIL_USER')}>`,
            to,
            subject: 'Congratulations! You Have Completed Your Training',
            html: `
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BASM AI | Training Complete</title>
<style>
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }

body {
  margin: 0;
  padding: 0;
  background-color: #000000;
  color: #CCCCCC;
  font-family: 'Arial', sans-serif;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #111111;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.2);
}

.header {
  background-color: #111111;
  padding: 40px 20px 20px;
  text-align: center;
  border-bottom: 1px solid #222222;
}

.branding {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #FF8C00;
  letter-spacing: 3px;
}

.subheader {
  font-size: 16px;
  color: #BBBBBB;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.content-area {
  padding: 40px 30px;
  line-height: 1.7;
  color: #CCCCCC;
}

.greeting {
  font-size: 18px;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.body-text {
  font-size: 16px;
  margin-bottom: 25px;
  color: #CCCCCC;
}

.cta-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #FF8C00;
  color: #111111;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(255, 140, 0, 0.4);
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #ffa733;
}

a.cta-button, a.cta-button:visited, a.cta-button:hover, a.cta-button:active {
  color: #111111 !important;
  background-color: #FF8C00 !important;
  text-decoration: none !important;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
  padding: 15px 30px;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(255, 140, 0, 0.4);
}

a.cta-button:hover {
  background-color: #ffa733 !important;
}

.footer {
  background-color: #000000;
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #555555;
  border-top: 1px solid #222222;
}
</style>
</head>
<body>
<center>
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="container">

          <!-- Header -->
          <tr>
            <td class="header">
              <span class="branding">BASM AI</span>
              <div class="subheader">Training Complete</div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-area">
              <p class="greeting" style="font-size: 18px; color: #FFFFFF; margin-bottom: 20px;">Congratulations, ${name}!</p>
              <p class="body-text" style="font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">
                You have successfully passed and completed all required remedial training modules based on your recent tabletop exercise.
              </p>
              <p class="body-text" style="font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">
                Your commitment to improving our collective cybersecurity posture is recognized and appreciated.
              </p>

              

              <p class="body-text" style="margin-top: 40px; font-size: 16px; margin-bottom: 25px; color: #CCCCCC;">Thank you for your diligence.</p>
              <p style="color: #CCCCCC;">— The BASM AI Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              &copy; ${new Date().getFullYear()} BASM AI | Tabletop Training. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</center>
</body>
</html>
        `,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

