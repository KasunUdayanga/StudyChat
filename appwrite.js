import {
  Client,
  Account,
  Databases,
  ID,
  Query,
  Storage,
  Permission,
  Role,
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);
client.setPlatform("com.kiu.studychat");

const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID;

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { bucketId };
export { ID, Query, Permission, Role };
export default client;
