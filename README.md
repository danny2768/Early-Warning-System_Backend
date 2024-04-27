
# Early Warnign System - Backend

This repository contains the backend of an IoT platform designed for the detection of early warnings of river overflows. The platform is designed to collect data from level, flow and rainfall sensors, and provide real-time alerts through a web interface and mobile application.

### To start this repository in development mode follow the next steps.

1. Clone .env.template and rename it to .env
2. Fill the environment variables
3. run ```docker compose up -d```
4. run ```npm run dev```


## Endpoints

1. _domain_/api/auth
    1. POST =>  /login
    2. POST =>  /register
    3. GET =>   /validate-email/:token
</br>

2. _domain_/api/readings
    1. getReadings
    &emsp;GET => /
    2. createReading
    &emsp;POST => /
    3. updateReading
    &emsp;POST => /:id
    4. deleteReading
    &emsp;DELETE => /:id
</br>

3. _domain_/api/sensors
    1. getSensors
    &emsp;GET => /
    2. getSensorById
    &emsp;GET => /:id
    3. getSensorByIdWithReadings
    &emsp;GET => /readings/:id
    4. createSensor
    &emsp;POST => /
    5. updateSensor
    &emsp;POST => /:id
    6. deleteSensor
    &emsp;DELETE => /:id
</br>

4. _domain_/api/stations
    1.  getStations
        &emsp;GET => /
    2.  getStationById
        &emsp;GET => /:id
    3.  createStation
        &emsp;POST => /        
    4.  updateStation
        &emsp;POST => /:id        
    5.  deleteStation
        &emsp;DELETE => /:id            
</br>

5. _domain_/api/networks
    1.  getNetworks
        &emsp;GET => /
    2.  getNetworkById
        &emsp;GET => /:id
    3.  createNetwork
        &emsp;POST => /        
    4.  updateNetwork
        &emsp;POST => /:id        
    5.  deleteNetwork
        &emsp;DELETE => /:id            
</br>

