import { Client, Account, Databases } from 'react-native-appwrite';

const client = new Client();

client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) 
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

// Add your platform/bundle ID from app.json
client.setPlatform('your.bundle.id'); 

export const account = new Account(client);
export const databases = new Databases(client);
export default client;