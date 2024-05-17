import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    JWT_SECRET: get("JWT_SECRET").required().asString(),    
    BASE_URL: get("BASE_URL").required().asString(),
    
    // Mongo
    MONGO_URL: get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: get('MONGO_DB_NAME').required().asString(),
    MONGO_USER: get('MONGO_USER').required().asString(),
    MONGO_PASS: get('MONGO_PASS').required().asString(),

    // Nodemailer
    MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
    MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
    MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),

    // Environment variable to send verification email
    SEND_EMAIL: get("SEND_EMAIL").default('false').asBool(),

}
