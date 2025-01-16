import { MqttClient } from "../../clients/mqtt.client";
import { CreateReadingDto, CustomError } from "../../domain";
import { ReadingService } from "./reading.service";
import { SharedService } from "./shared.service";

export interface StationSubscription {
    dataTopic: string;
    configTopic: string;
}

interface DataMessage {
    station: string;
    sensors: Sensor[]
}

interface Sensor {
    id: string;
    value: number;
    type: 'level' | 'flow' | 'rain';
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

        // Create a new instance of the shared service
        const sharedService = new SharedService();
        // Create a new instance of the reading service
        const readingService = new ReadingService(sharedService);

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
                // Parse the message
                const payload: DataMessage = JSON.parse(message.toString());
                console.log(`Message received from topic ${topic}:`);

                // Process the message
                stations.forEach(({ dataTopic, configTopic }) => {
                    if (topic === dataTopic) {
                        
                        payload.sensors.forEach(async (sensor) => {
                            const { id, value, type } = sensor;
                            const [ error, createReadingDto ] = CreateReadingDto.create({ value, sensor: id });
                            
                            if (error) {
                                console.error(`Error creating reading for sensor ${id}:`, error, payload);
                                return;
                            }                    

                            readingService.createReading(createReadingDto!)
                                .then((reading) => console.log(`Reading created for sensor ${id}:`)) // TODO: Implement subscription to reading creation
                                .catch((err) => console.error(`Error creating reading for sensor ${id}:`, err, payload));
                        });

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
