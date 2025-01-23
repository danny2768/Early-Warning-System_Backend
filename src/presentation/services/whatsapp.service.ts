import axios from 'axios';
import { CustomError } from '../../domain';
import { WhatsappClient } from '../../clients/whatsapp.client';
import { RiverAlertType } from '../../domain/interfaces/enums';

export interface SendAlertMessageOptions {
    alertType: RiverAlertType;
    languageCode: 'en' | 'es';
    to: string;    
    region: string;
    organizationName: string;
}

export class WhatsappService {    
    private static client: WhatsappClient;

    static initialize(client: WhatsappClient) {
        this.client = client;
    }

    async sendAlert(options: SendAlertMessageOptions): Promise<boolean> {
        const { alertType, languageCode, to, region, organizationName } = options;

        if (!WhatsappService.client) {
            throw CustomError.internalServer('WhatsappClient is not initialized');
        }

        try {
            await WhatsappService.client.sendMessageTemplate({
                to,
                templateName: `${alertType}_${languageCode}`,
                languageCode,
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'text',
                                text: organizationName, // Organization name
                            },
                        ],
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: region, // Alert location or region
                            },
                            {
                                type: 'text',
                                text: organizationName, // Organization name
                            },
                        ],
                    },
                ],
            });

            return true;
        } catch (error: any) {
            console.error('Error sending WhatsApp message:', error.message);
            throw CustomError.internalServer(`Error sending the WhatsApp message: ${error.message}`);
        }
    }
}