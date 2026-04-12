# StudyChat

A small React Native / Expo chat demo using Appwrite for authentication, databases and storage. It supports:

- Email/password auth (Appwrite Auth)
- Sending text and image messages
- Image upload to Appwrite Storage (files stored in a bucket)
- Member list inferred from messages (shows sender names)
- Delete messages (deletes database document and stored image file)
- Animated combined Login/Register component

This repository is intended as a learning/demo project and a lightweight starting point for building an Appwrite-backed chat client.

## Quick start (Windows PowerShell)

1. Install dependencies

   npm install

2. Set required environment variables for Appwrite (PowerShell example)

   $Env:EXPO_PUBLIC_APPWRITE_ENDPOINT = "https://[YOUR_APPWRITE_ENDPOINT]"
   $Env:EXPO_PUBLIC_APPWRITE_PROJECT_ID = "[YOUR_PROJECT_ID]"
   $Env:EXPO_PUBLIC_APPWRITE_BUCKET_ID = "[YOUR_BUCKET_ID]"
   $Env:EXPO_PUBLIC_APPWRITE_DATABASE_ID = "[YOUR_DATABASE_ID]"
   $Env:EXPO_PUBLIC_APPWRITE_COLLECTION_ID = "[YOUR_COLLECTION_ID]"

Note: Expo does not automatically load .env files without extra packages. Setting env variables in the shell (as above) is the simplest way during development. You can also add values to your CI/EAS secrets or use a proper .env loader.

3. Start the app (web / native)

   npm run web # open in the browser (Expo web)
   npm run android # open on Android device/emulator
   npm run ios # open on iOS simulator (macOS only)

## Appwrite configuration checklist

- Auth: make sure Email/Password authentication is enabled and you can create users.
- Databases: create a Database and Collection for messages; the app expects to write documents with fields like senderId, senderName, receiverId, content, timestamp, status, messageType.
- Storage: create a Bucket and set a public read policy (or allow read via generated file URLs). Copy the Bucket ID into EXPO_PUBLIC_APPWRITE_BUCKET_ID.
- Permissions: the app uploads files with explicit permissions using the Appwrite SDK (e.g. Permission.read(Role.any()), Permission.write(Role.user(userId))). Make sure the bucket accepts the permissions scheme used.

## Key files / components

- `App.js` — App root: session check, message fetch/format, send/delete handlers, navigation.
- `appwrite.js` — Appwrite client export: Client, Account, Databases, Storage, plus exported IDs and helpers.
- `screens/ChatScreen.js` — Uploads images, optimistic UI, passes delete actions.
- `components/MessageList.js` — Renders messages, images, and a delete button; includes image load fallback.
- `components/MessageInput.js` — Input bar and attach/send icons.
- `components/AuthFormSwitcher.js` — Combined login/register UI with animations.
- `screens/MembersScreen.js` — Shows members inferred from messages (uses senderName if present).

## Behavior notes and troubleshooting

- Image uploads: the app uploads files and stores the returned `fileId` in the message `content`. On fetch, the code converts fileIds to file view URLs with `storage.getFileView(bucketId, fileId)`.
- If images appear blank or return 404: check that `EXPO_PUBLIC_APPWRITE_BUCKET_ID` is set correctly, the bucket exists, and the file permissions allow getting the file. Check the browser console or Metro logs for Appwrite errors.
- Deletion: deleting a message will remove the DB document and attempt to delete the storage file if the message has a `fileId`. If a file is already removed, the delete call will be ignored (warning logged).
- Legacy messages: older messages without `senderName` will show a fallback "Member" name. Sending a new message from a user will store `senderName` for future lists.

## Development tips

- Use Expo web for quick iteration: `npm run web`.
- If you need persistent env loading, add dotenv support or set values in Expo app.json/eas.
- To debug Appwrite issues, open the browser console (web) or Metro logs (native) to see SDK errors. Many failures are caused by wrong endpoints, missing project ID, or incorrect bucket/database IDs.

## Contributing

PRs welcome. Keep changes focused and add small tests where possible. If you improve Appwrite wiring or add features (reactions, typing indicators), document them in this README.

## License

MIT — feel free to reuse or adapt for your projects.
