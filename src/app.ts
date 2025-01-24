import { envs } from "./config/envs";
import { MongoDatabase } from './data';
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { MqttClient } from "./clients/mqtt.client";
import { MqttService } from "./presentation/services/mqtt.service";
import { WhatsappClient } from "./clients/whatsapp.client";
import { WhatsappService } from "./presentation/services/whatsapp.service";

(async() => {
    main();
})();

async function main() {
    // Initialize MongoDB
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME,
    });
    
    // Initialize MQTT client
    const mqttClient = new MqttClient({
        url: envs.MQTT_BROKER_URL,
        clientId: envs.MQTT_CLIENT_ID,
        username: envs.MQTT_USERNAME,
        password: envs.MQTT_PASSWORD,
    });

    const mailerServiceOptions = {
        mailerService: envs.MAILER_SERVICE,
        mailerEmail: envs.MAILER_EMAIL,
        senderEmailPassword: envs.MAILER_SECRET_KEY,
        postToProvider: true,
    }

    // Initialize MQTT service
    // MqttService.initialize(mqttClient, mailerServiceOptions);

    // Initialize whatsapp client
    const whatsappClient = new WhatsappClient({
        apiURL: `https://graph.facebook.com/${envs.WHATSAPP_API_VERSION}/${envs.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        authToken: envs.WHATSAPP_AUTH_TOKEN,
    })

    // Initialize whatsapp service
    WhatsappService.initialize(whatsappClient);

    // Initialize express server
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
        frontendOrigin: envs.FRONTEND_ORIGIN,
    })
    
    server.start();
}
