import mqtt from "mqtt";

export interface MqttClientOptions {
    url: string;
    clientId: string;
    username: string;
    password: string;
}

export class MqttClient {
    private client: mqtt.MqttClient;

    constructor( options: MqttClientOptions ) {
        const { url, clientId, username, password } = options;

        this.client = mqtt.connect(url, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username,
            password,
            reconnectPeriod: 1000,
        });
    }

    subscribeToDataTopic(topic: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.subscribe(topic, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
    

    onMessage(callback: (topic: string, message: Buffer) => void) {
        this.client.on("message", callback);
    }

    onConnect(callback: () => void) {
        this.client.on("connect", callback);
    }

    onError(callback: (error: Error) => void) {
        this.client.on("error", callback);
    }
    
    onDisconnect(callback: (packet: mqtt.Packet) => void) {
        this.client.on("offline", () => console.log("Client offline"));
        this.client.on("close", () => console.log("Client close"));
        this.client.on("disconnect", callback);
    }

    disconnect() {
        this.client.end(false, () => {
            console.log("MQTT client disconnected");
        });
    }
    
    publish(topic: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(topic, message, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
