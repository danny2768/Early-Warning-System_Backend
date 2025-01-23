import nodemailer, { Transporter } from "nodemailer";
import { RiverAlertType } from "../../domain/interfaces/enums";
import { emailTemplates } from "../../domain/interfaces/river-alert-email-templates";

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachements?: Attachement[];
}

export interface Attachement {
    filename: string;
    path: string;
}

export interface SendAlertEmailOptions {
    alertType: RiverAlertType;
    languageCode: 'en' | 'es';
    to: string | string[];
    region: string;
    organizationName: string;
}

export class EmailService {
    
    private transporter: Transporter;    

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
        private readonly postToProvider: boolean,
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword,
            },
        });
    }

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachements = [] } = options;

        try {
            if (!this.postToProvider) return true;

            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });

            // console.log( sentInformation );

            return true;
        } catch (error) {
            return false;
        }
    }

    async sendAlert(options: SendAlertEmailOptions): Promise<boolean> {
        const { alertType, languageCode, to, region, organizationName } = options;

        const subject = `Alert: ${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert for ${region}`;
        const htmlBody = emailTemplates[alertType][languageCode](region, organizationName);

        return this.sendEmail({ to, subject, htmlBody });
    }
}