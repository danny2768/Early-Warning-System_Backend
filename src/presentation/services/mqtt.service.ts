import { MqttClient } from "../../clients/mqtt.client";
import { CustomError } from "../../domain";

export interface StationSubscription {
    dataTopic: string;
    configTopic: string;
}

const stations: StationSubscription[] = [
    {
        dataTopic: 'esp32/estacion1',
        configTopic: 'esp32/estacion1/config',
    },
    {
        dataTopic: 'esp32/estacion2',
        configTopic: 'esp32/estacion2/config',
    },
];

export class MqttService {
    private static client: MqttClient

    static initialize(client: MqttClient) {
        this.client = client;

        this.client.onConnect(() => {
            console.log('Connected to MQTT Broker');

            stations.forEach(({ dataTopic, configTopic }) => {
                this.client.subscribeToDataTopic(dataTopic)
                    .then(() => console.log(`Subscribed to topic: ${dataTopic}`))
                    .catch((err) => console.error(`Subscription error for ${dataTopic}:`, err));

                this.client.subscribeToDataTopic(configTopic)
                    .then(() => console.log(`Subscribed to topic: ${configTopic}`))
                    .catch((err) => console.error(`Subscription error for ${configTopic}:`, err));
            });
        });

        this.client.onMessage((topic, message) => {
            try {
                const payload = JSON.parse(message.toString());
                console.log(`Message received from topic ${topic}:`, payload);

                stations.forEach(({ dataTopic, configTopic }) => {
                    if (topic === dataTopic) {
                        console.log(`Processing data from ${dataTopic}`);
                    }
                    if (topic === configTopic) {
                        console.log(`Processing configuration message from ${configTopic}`);
                    }
                });
            } catch (err) {
                console.error('Error processing message:', err);
            }
        });

        this.client.onError((err) => console.error('MQTT Client Error:', err));
        this.client.onDisconnect(() => console.log('Disconnected from MQTT Broker'));
    }

    static sendConfigMessage(configTopic: string, distInterval: number, flowInterval: number, waterInterval: number) {
        if (!this.client) {
            throw CustomError.internalServer('MQTT Client is not initialized');
        }

        const configMessage = {
            action: 'update_interval',
            data: {
                distInterval,
                flowInterval,
                waterInterval,
            },
        };

        this.client.publish(configTopic, JSON.stringify(configMessage))
            .then(() => console.log(`Configuration message sent successfully to ${configTopic}`))
            .catch((err) => console.error(`Failed to publish configuration message to ${configTopic}`, err));
    }
}
