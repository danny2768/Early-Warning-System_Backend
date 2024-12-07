import mqtt from 'mqtt';

const mqttBrokerUrl = 'mqtt://junction.proxy.rlwy.net:19243';
const dataTopic1 = 'esp32/estacion1';
const configTopic1 = 'esp32/estacion1/config';
const dataTopic2 = 'esp32/estacion2';  // Tópico para la estación 2
const configTopic2 = 'esp32/estacion2/config';  // Tópico de configuración para la estación 2


const client = mqtt.connect(mqttBrokerUrl, {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 4000,
  username: 'backend_user',
  password: 'secret',
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  // Suscribirse a los tópicos de la estación 1
  client.subscribe(dataTopic1, (err) => {
    if (err) {
      console.error('Subscription error for station 1 data topic:', err);
    } else {
      console.log(`Subscribed to topic: ${dataTopic1}`);
    }
  });
  
  client.subscribe(configTopic1, (err) => {
    if (err) {
      console.error('Subscription error for station 1 config topic:', err);
    } else {
      console.log(`Subscribed to topic: ${configTopic1}`);
    }
  });
  
  // Suscribirse a los tópicos de la estación 2
  client.subscribe(dataTopic2, (err) => {
    if (err) {
      console.error('Subscription error for station 2 data topic:', err);
    } else {
      console.log(`Subscribed to topic: ${dataTopic2}`);
    }
  });

  client.subscribe(configTopic2, (err) => {
    if (err) {
      console.error('Subscription error for station 2 config topic:', err);
    } else {
      console.log(`Subscribed to topic: ${configTopic2}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    console.log(`Message received from topic ${topic}:`, payload);

    // Lógica para manejar los datos de la estación 1
    if (topic === dataTopic1) {
      console.log("Processing data from station 1...");
      // Procesar datos de la estación 1
    }

    // Lógica para manejar los datos de la estación 2
    else if (topic === dataTopic2) {
      console.log("Processing data from station 2...");
      // Procesar datos de la estación 2
    }

    // Lógica para manejar las configuraciones
    if (topic === configTopic1 || topic === configTopic2) {
      console.log("Processing configuration message...");
      // Procesar configuraciones
    }

  } catch (err) {
    console.error('Error processing message:', err);
  }
});


client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});

client.on('reconnect', () => {
  console.log('Reconnecting to MQTT Broker...');
});

client.on('close', () => {
  console.log('Disconnected from MQTT Broker');
});

// Función para enviar mensajes de configuración
const sendConfigMessage = (distInterval: number, flowInterval: number, waterInterval: number) => {
  const configMessage = {
    action: 'update_interval',
    data: {
      distInterval,
      flowInterval,
      waterInterval,
    },
  };

  client.publish(configTopic1, JSON.stringify(configMessage), (err) => {
    if (err) {
      console.error('Failed to publish configuration message', err);
    } else {
      console.log('Configuration message sent successfully');
    }
  });
};


sendConfigMessage(20000, 30000, 2000); // Intervalos en milisegundos
//endpoint

const sendConfigMessageStation2 = (distInterval: number, flowInterval: number, waterInterval: number) => {
  const configMessage = {
    action: 'update_interval',
    data: {
      distInterval,
      flowInterval,
      waterInterval,
    },
  };

  client.publish(configTopic2, JSON.stringify(configMessage), (err) => {
    if (err) {
      console.error('Failed to publish configuration message for station 2', err);
    } else {
      console.log('Configuration message sent successfully to station 2');
    }
  });
};

// Enviar la configuración de la estación 2
sendConfigMessageStation2(20000, 30000, 2000);
