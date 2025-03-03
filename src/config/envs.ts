import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    // General
    PORT: get('PORT').required().asPortNumber(),
    JWT_SECRET: get("JWT_SECRET").required().asString(),    
    BASE_URL: get("BASE_URL").required().asString(),
    FRONTEND_ORIGIN: get("FRONTEND_ORIGIN").required().asString(),
    ALERT_INTERVAL: get("ALERT_INTERVAL").required().asString(),
    
    // Mongo
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    MONGO_USER: get('MONGO_USER').required().asString(),
    MONGO_PASS: get('MONGO_PASS').required().asString(),

    // Nodemailer
    SEND_EMAIL: get("SEND_EMAIL").default('false').asBool(), // Environment variable to send verification email
    MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
    MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
    MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),

    // Whatsapp
    WHATSAPP_API_VERSION: get("WHATSAPP_API_VERSION").required().asString(),
    WHATSAPP_PHONE_NUMBER_ID: get("WHATSAPP_PHONE_NUMBER_ID").required().asString(),
    WHATSAPP_AUTH_TOKEN: get("WHATSAPP_AUTH_TOKEN").required().asString(),

    // Mqtt
    MQTT_BROKER_URL: get('MQTT_BROKER_URL').required().asString(),
    MQTT_CLIENT_ID: get('MQTT_CLIENT_ID').required().asString(),
    MQTT_USERNAME: get('MQTT_USERNAME').required().asString(),
    MQTT_PASSWORD: get('MQTT_PASSWORD').required().asString(),
    
}
