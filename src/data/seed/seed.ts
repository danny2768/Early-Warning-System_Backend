import { envs } from "../../config";
import { NetworkModel } from "../mongo/models/network.model";
import { ReadingModel } from "../mongo/models/reading.model";
import { SensorModel } from "../mongo/models/sensor.model";
import { StationModel } from "../mongo/models/station.model";
import { SubscriptionModel } from "../mongo/models/subscription.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database";
import { seedData } from "./data";

(async () => {
    if (process.env.NODE_ENV !== 'development') {
        console.log('Seed data can only be loaded in development mode');
        process.exit(1);
    }

    try {
        await MongoDatabase.connect({
            dbName: envs.MONGO_DB_NAME,
            mongoUrl: envs.MONGO_URL,
        });
        console.log("Database connected successfully");
    
        await main();
    
    } catch (err) {
        console.error("Error during seeding process:", err);
    } finally {
        await MongoDatabase.disconnect();
        console.log("Database disconnected successfully");
        process.exit(0);
    }    

}) ();

const randomBetween0AndX = (x: number) => Math.floor(Math.random() * x);

async function main() {
    
    // 0. Delete all data
    await Promise.all([
        UserModel.deleteMany(),
        NetworkModel.deleteMany(),
        StationModel.deleteMany(),
        SensorModel.deleteMany(),
        ReadingModel.deleteMany(),
        SubscriptionModel.deleteMany(),
    ]);
    console.log('All data deleted');

    // 1. Create users
    const users = await UserModel.insertMany(seedData.users);
    console.log('Users created');
    
    // 2. Create networks
    const networks = await NetworkModel.insertMany(seedData.networks);
    console.log('Networks created');

    // 3. Create stations
    const stations = await StationModel.insertMany(seedData.stations.map((station, index) => ({
        ...station,
        networkId: networks[randomBetween0AndX(networks.length)]._id,
    })));
    console.log('Stations created');

    // 4. Create sensors

    // * Sensors are created in a loop, one by one
    // const sensors = await SensorModel.insertMany(seedData.sensors.map((sensor, index) => ({
    //     ...sensor,
    //     stationId: stations[randomBetween0AndX(stations.length)]._id,
    // })));

    // * Sensors are created in a loop, one by one, but only if the station does not already have a sensor of this type
    const sensors: any = [];

    for (const sensor of seedData.sensors) {
        // Get a list of stations that do not already have a sensor of this type
        const availableStations = await Promise.all(stations.filter(async (station) => {
            const existingSensors = await SensorModel.find({ stationId: station._id });
            return !existingSensors.some(existingSensor => existingSensor.sensorType === sensor.sensorType);
        }));

        // If there are no available stations, skip this sensor
        if (availableStations.length === 0) {
            console.log(`No available stations for sensor type ${sensor.sensorType}`);
            continue;
        }

        // Select a random available station
        const station = availableStations[randomBetween0AndX(availableStations.length)];

        // Assign the sensor to the selected station
        const createdSensor = await SensorModel.create({
            ...sensor,
            stationId: station._id,
        });

        sensors.push(createdSensor);
    }
    console.log('Sensors created');

    // 5. Create readings
    const readings: any = [];
    const now = Date.now();
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    const readingsAmount = 100;
    const interval = tenDaysInMs / readingsAmount; // Spread readings over 10 days

    for (const sensor of sensors) {
        for (let i = 0; i < readingsAmount; i++) {
            const reading = {
                value: seedData.readings[randomBetween0AndX(seedData.readings.length)].value,
                sensor: sensor._id,
                createdAt: new Date(now - (i * interval)),
            };
            readings.push(reading);
        }
    }

    await ReadingModel.insertMany(readings);
    console.log('Readings created');

    // 6. Create subscriptions
    const subscriptionsMap: Record<string, any> = {}; // To accumulate station subscriptions per user

    for (let i = 0; i < seedData.subscriptions.length; i++) {
        const user = users[i % users.length]; // Ensures looping over users if more subscriptions than users
        const subscriptionData = seedData.subscriptions[i];

        // Randomly pick some stations for each subscription
        const stationIds = stations
            .filter(() => Math.random() > 0.5) // Randomly select some stations
            .map(station => station._id);

        // If no stations are selected, assign at least one station
        if (stationIds.length === 0) {
            stationIds.push(stations[randomBetween0AndX(stations.length)]._id);
        }

        // If this user already has a subscription, aggregate the stations
        if (subscriptionsMap[String(user._id)]) {
            subscriptionsMap[String(user._id)].stationIds.push(...stationIds);
        } else {
            // Otherwise, create a new subscription entry for the user
            subscriptionsMap[String(user._id)] = {
                userId: user._id,
                stationIds: stationIds,
                contactMethods: subscriptionData.contactMethods,
            };
        }
    }

    // Convert the subscriptions map to an array and insert into the database
    const subscriptions = await SubscriptionModel.insertMany(Object.values(subscriptionsMap));
    console.log('Subscriptions created\n');

    console.log('Seed data loaded successfully\n');
}