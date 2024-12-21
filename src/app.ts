import { envs } from "./config/envs";
import { MongoDatabase } from './data';
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { MqttClient } from "./clients/mqtt.client";
import { MqttService } from "./presentation/services/mqtt.service";

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

    // Initialize MQTT service
    MqttService.initialize(mqttClient);

    // Initialize express server
    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
        frontendOrigin: envs.FRONTEND_ORIGIN,
    })
    
    server.start();
}
