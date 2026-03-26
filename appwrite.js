import { Client, Account, Databases, ID } from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
client.setPlatform("com.kiu.studychat");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
export default client;
