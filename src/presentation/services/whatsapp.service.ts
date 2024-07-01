import axios from 'axios';
import { CustomError } from '../../domain';

export enum RiverAlertType {
    yellow = 'river_yellow_alert',
    orange = 'river_orange_alert',
    red = 'river_red_alert',
    falseAlarm = 'false_alarm_notification'
}

export interface sendAlertMessageOptions {
    alertType: RiverAlertType;
    languageCode: 'en' | 'es';
    to: string;    
    region: string;
    organizationName: string;
}

export class WhatsappService {    

    private apiURL: string;
    private authToken: string;

    constructor(
        whatsappAPIVersion: string,
        whatsappPhoneNumberId: string,
        whatsappAuthToken: string,
    ) {
        this.apiURL = `https://graph.facebook.com/${whatsappAPIVersion}/${whatsappPhoneNumberId}/messages`;
        this.authToken = whatsappAuthToken
    }    

    async sendAlert( options: sendAlertMessageOptions ) {
        const { alertType, languageCode, to, region, organizationName } = options;

        try {
            const response = await axios.post(this.apiURL, {
                messaging_product: 'whatsapp',
                to: to,
                type: 'template',
                template: {
                    name: `${alertType}_${languageCode}`,
                    language: {
                        code: languageCode
                    },
                    components: [
                        {
                            type: 'header',
                            parameters: [
                                {
                                    type: 'text',
                                    text: organizationName // Organization name
                                }
                            ]
                        },
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: region // Alert location or region
                                },
                                {
                                    type: 'text',
                                    text: organizationName // Organization nane
                                }
                            ]
                        }
                    ]
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return true;
        } catch (error: any) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            return CustomError.internalServer(`Error sending the message`)
        }
    }
}