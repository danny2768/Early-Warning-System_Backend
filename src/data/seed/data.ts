import { BcryptAdapter } from "../../config";


export const seedData = {
    users: [
        { 
            name: 'Daniel Cobos', 
            email: 'daniel.eduardo.cobos@hotmail.com', 
            emailValidated: false, 
            password: BcryptAdapter.hash('adminadmin'),
            role: ['SUPER_ADMIN_ROLE'],
        },
        {
            name: 'Super Admin 1',
            email: 'super@admin.com',
            emailValidated: false,
            password: BcryptAdapter.hash('superadmin'),
            role: ['SUPER_ADMIN_ROLE'],
        },
        {
            name: 'Admin 1',
            email: 'admin@admin.com',
            emailValidated: false,
            password: BcryptAdapter.hash('adminadmin'),
            role: ['ADMIN_ROLE'],
        },
        {
            name: 'User 1',
            email: 'user@user.com',
            emailValidated: false,
            password: BcryptAdapter.hash('useruser'),
            role: ['USER_ROLE'],
        },
    ],
    networks: [
        { name: 'Network 1', description: 'Description of network 1' },
        { name: 'Network 2', description: 'Description of network 2' },
        { name: 'Network 3', description: 'Description of network 4' },
        { name: 'Network 4', description: 'Description of network 5' },        
    ],
    stations: [
        { name: 'Station 1', city: 'City 1', state: 'State 1', countryCode: 'COL', coordinates: { longitude: 1.601554, latitude: 42.546245 }, isVisibleToUser: true },
        { name: 'Station 2', city: 'City 2', state: 'State 2', countryCode: 'COL', coordinates: { longitude: -154.493062, latitude: 63.588753 }, isVisibleToUser: true },
        { name: 'Station 3', city: 'City 3', state: 'State 3', countryCode: 'COL', coordinates: { longitude: 53.847818, latitude: 23.424076 }, isVisibleToUser: true },
        { name: 'Station 4', city: 'City 4', state: 'State 4', countryCode: 'COL', coordinates: { longitude: -86.902298, latitude: 32.318231 }, isVisibleToUser: true },
        { name: 'Station 5', city: 'City 5', state: 'State 5', countryCode: 'COL', coordinates: { longitude: -74.297333, latitude: 4.570868 }, isVisibleToUser: true },
        { name: 'Station 6', city: 'City 6', state: 'State 6', countryCode: 'COL', coordinates: { longitude: 6.129583, latitude: 49.815273 }, isVisibleToUser: true },
        { name: 'Station 7', city: 'City 7', state: 'State 7', countryCode: 'COL', coordinates: { longitude: 9.501785, latitude: 56.26392 }, isVisibleToUser: true },
        { name: 'Station 8', city: 'City 8', state: 'State 8', countryCode: 'COL', coordinates: { longitude: 21.758664, latitude: 41.608635 }, isVisibleToUser: true },
        { name: 'Station 9', city: 'City 9', state: 'State 9', countryCode: 'COL', coordinates: { longitude: 25.48583, latitude: 42.733883 }, isVisibleToUser: true },
        { name: 'Station 10', city: 'City 10', state: 'State 10', countryCode: 'COL', coordinates: { longitude: 19.145136, latitude: 51.919438 }, isVisibleToUser: true },
        { name: 'Station 11', city: 'City 11', state: 'State 11', countryCode: 'COL', coordinates: { longitude: 31.16558, latitude: 48.379433 }, isVisibleToUser: true },
        { name: 'Station 12', city: 'City 12', state: 'State 12', countryCode: 'COL', coordinates: { longitude: -1.659626, latitude: 48.379433 }, isVisibleToUser: true },
    ],    
    sensors: [
        { name: 'Sensor 1', sensorType: 'level', threshold: { yellow: 10, orange: 20, red: 30 }, sendingInterval: 10, sendAlerts: true },
        { name: 'Sensor 2', sensorType: 'flow', threshold: { yellow: 20, orange: 30, red: 40 }, sendingInterval: 15, sendAlerts: true },
        { name: 'Sensor 3', sensorType: 'rain', threshold: { yellow: 50, orange: 60, red: 70 }, sendingInterval: 30, sendAlerts: true },
        { name: 'Sensor 4', sensorType: 'level', threshold: { yellow: 15, orange: 25, red: 35 }, sendingInterval: 12, sendAlerts: true },
        { name: 'Sensor 5', sensorType: 'flow', threshold: { yellow: 25, orange: 35, red: 45 }, sendingInterval: 18, sendAlerts: true },
        { name: 'Sensor 6', sensorType: 'rain', threshold: { yellow: 55, orange: 65, red: 75 }, sendingInterval: 35, sendAlerts: true },
    ],
    readings: [
        { value: 10 },
        { value: 20 },
        { value: 30 },
        { value: 40 },
        { value: 50 },
        { value: 60 },
        { value: 70 },
        { value: 80 },
        { value: 90 },
        { value: 100 },
        { value: 110 },
        { value: 120 },
        { value: 130 },
        { value: 140 },
        { value: 150 },
        { value: 160 },
        { value: 170 },
        { value: 180 },
        { value: 190 },
        { value: 200 },
    ],
    subscriptions: [
        { contactMethods: { email: true, whatsapp: false } },
        { contactMethods: { email: true, whatsapp: false } },
        { contactMethods: { email: true, whatsapp: false } },
        { contactMethods: { email: true, whatsapp: true } },
        { contactMethods: { email: true, whatsapp: true } },
        { contactMethods: { email: true, whatsapp: true } },
        { contactMethods: { email: false, whatsapp: true } },
        { contactMethods: { email: false, whatsapp: true } },
        { contactMethods: { email: false, whatsapp: true } },
        { contactMethods: { email: false, whatsapp: false } },
        { contactMethods: { email: false, whatsapp: false } },
        { contactMethods: { email: false, whatsapp: false } },
    ],
    
    
};