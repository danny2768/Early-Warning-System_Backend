# Early Warning System - Backend

This repository contains the backend of an IoT platform designed for the detection of early warnings of river overflows. The platform is designed to collect data from level, flow, and rainfall sensors, and provide real-time alerts through a web interface and mobile application.

## Getting Started

To start this repository in development mode, follow the next steps:

1. Clone .env.template and rename it to .env
2. Fill the environment variables
3. Run `docker compose up -d`
4. Run `npm run dev`

## Environment Variables

The following environment variables are required for the application to run properly:

- `PORT`: The port on which the server will run.
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.
- `SEND_EMAIL`: Boolean to enable/disable email sending.
- `MAILER_SERVICE`: The email service used for sending emails. For example, if you're using Gmail, this would be 'gmail'.
- `MAILER_EMAIL`: The email address used to send emails.
- `MAILER_SECRET_KEY`: The secret key provided by your mailer service (e.g., Gmail) to authorize the application to send emails. This key is typically obtained through the service's developer console or API settings.
- `MONGO_URL`: The URL of your MongoDB server.
- `MONGO_DB_NAME`: The name of your MongoDB database.
- `MONGO_USER`: The username for your MongoDB database.
- `MONGO_PASS`: The password for your MongoDB database.
- `BASE_URL`: The base URL of your application.
- `NODE_ENV`: The environment in which your application is running (development, production, etc.).

Please refer to the `.env.template` file and fill in the appropriate values.

## Documentation

API documentation is available through Swagger UI. You can access it at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).