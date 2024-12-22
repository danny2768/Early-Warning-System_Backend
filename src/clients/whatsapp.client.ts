import axios from "axios";
import { SendMessageTemplateOptions } from "./interfaces/whatsapp-template.interface";

export interface WhatsappClientOptions {
    apiURL: string;
    authToken: string;
}

export class WhatsappClient {
    private apiURL: string;
    private authToken: string;

    constructor(options: WhatsappClientOptions) {
        const { apiURL, authToken } = options;

        this.apiURL = apiURL;
        this.authToken = authToken;
    }

    async sendMessageTemplate(options: SendMessageTemplateOptions) {
        const { to, templateName, languageCode, components } = options;
        try {
            const response = await axios.post(
                this.apiURL,
                {
                    messaging_product: "whatsapp",
                    to,
                    type: "template",
                    template: {
                        name: templateName,
                        language: { code: languageCode },
                        components,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response;
        } catch (error: any) {
            // Handle Axios-specific error
            if (error.response) {
                console.error("WhatsApp API Error:", error.response.data);
                throw new Error(
                    `WhatsApp API responded with an error: ${error.response.data.error.message}`
                );
            }

            // Handle unexpected errors
            console.error("Unexpected error:", error.message);
            throw new Error(
                "Failed to send WhatsApp message due to an unexpected error"
            );
        }
    }
}
