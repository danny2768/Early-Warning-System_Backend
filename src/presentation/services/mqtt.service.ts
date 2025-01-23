import { MqttClient } from "../../clients/mqtt.client";
import { SensorModel, StationModel } from "../../data";
import { CreateReadingDto, CustomError, ReadingEntity, SensorEntity, UserEntity } from "../../domain";
import { RiverAlertType } from "../../domain/interfaces/enums";
import { EmailService } from "./email.service";
import { ReadingService } from "./reading.service";
import { SharedService } from "./shared.service";
import { SubscriptionService } from "./subscription.service";
import { WhatsappService } from "./whatsapp.service";

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

interface MailerServiceOptions {
    mailerService: string;
    mailerEmail: string;
    senderEmailPassword: string;
    postToProvider: boolean;
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
    private static sharedService: SharedService;
    private static whatsappService: WhatsappService;
    private static emailService: EmailService;
    private static subscriptionService: SubscriptionService;
    private static lastAlertTimes: Map<string, number> = new Map(); // Map to store last alert times
    private static alertCooldown: number = 5 * 60 * 1000; // 5 minutes cooldown

    static initialize(client: MqttClient, mailerServiceOptions: MailerServiceOptions) {
        this.client = client;

        // Create needed services instances
        this.sharedService = new SharedService();
        this.whatsappService = new WhatsappService();

        const { mailerService, mailerEmail, senderEmailPassword, postToProvider } = mailerServiceOptions;
        this.emailService = new EmailService(mailerService, mailerEmail, senderEmailPassword, postToProvider);

        this.subscriptionService = new SubscriptionService(this.sharedService);

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
                                .then((reading) => this.checkIfAlertIsNeeded(reading))
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

    private static async checkIfAlertIsNeeded(reading: ReadingEntity) {
        // Check if alert is needed
        const sensorDB = await SensorModel.findById(reading.sensor);
        
        if (!sensorDB) {
            console.error(`Sensor with id ${reading.sensor} not found`);
            return;
        }

        const sensor = SensorEntity.fromObj(sensorDB);

        // Check cooldown
        const lastAlertTime = this.lastAlertTimes.get(sensor.id) || 0;
        const currentTime = Date.now();
        if (currentTime - lastAlertTime < this.alertCooldown) {
            console.log(`Alert for sensor ${sensor.id} is on cooldown`);
            return;
        }

        if (sensor.threshold?.red && reading.value > sensor.threshold.red) {
            this.sendAlerts(RiverAlertType.red, sensor);
            this.lastAlertTimes.set(sensor.id, currentTime); // Update last alert time
            return;
        }

        if (sensor.threshold?.orange && reading.value > sensor.threshold.orange) {
            this.sendAlerts(RiverAlertType.orange, sensor);
            this.lastAlertTimes.set(sensor.id, currentTime); // Update last alert time
            return;
        }

        if (sensor.threshold?.yellow && reading.value > sensor.threshold.yellow) {
            this.sendAlerts(RiverAlertType.yellow, sensor);
            this.lastAlertTimes.set(sensor.id, currentTime); // Update last alert time
            return;
        }
    }

    private static async sendAlerts(alertType: RiverAlertType, sensor: SensorEntity) {
        // Get station
        const station = await StationModel.findById(sensor.stationId);

        if (!station) {
            console.error(`Station with id ${sensor.stationId} not found`);
            return;
        }

        // Find users subscribed to this station
        const users: UserEntity[] = await this.subscriptionService.findUsersSubscribedToStation(station.id);

        // Set alert data
        const languageCode: 'en' | 'es' = 'es';
        const region = station.state;
        const organizationName = 'FloodGuard';

        for (const user of users) {
            // Find user subscription
            const subscription = await this.subscriptionService.getSubscriptionByUserId(user.id);

            // Check if user has a subscription
            if (!subscription) {
                console.error(`Subscription not found for user ${user.id}`);
                continue;
            }

            // Send alerts based on user preferences
            if (subscription.contactMethods.email) {
                if (!user.emailValidated) {
                    console.error(`Email not validated for user ${user.id}`);
                    continue;
                }

                try {
                    // Send email
                    this.emailService.sendAlert({
                        alertType,
                        languageCode,
                        to: user.email,
                        region,
                        organizationName,
                    });
                } catch (error) {
                    console.log(`Error sending email to user ${user.id}:`, error);
                }
            }

            if (subscription.contactMethods.whatsapp) {      
                if (user.phone && user.phone?.countryCode && user.phone?.number) {
                    try {
                        // Send WhatsApp message
                        this.whatsappService.sendAlert({
                            alertType,
                            languageCode,
                            to: `${user.phone.countryCode}${user.phone.number}`,
                            region,
                            organizationName,
                        });
                    } catch (error) {
                        console.log(`Error sending WhatsApp message to user ${user.id}:`, error);
                    }
                } else {
                    console.error(`Phone not found for user ${user.id}`);
                }
            }
        }
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
