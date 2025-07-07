import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('685377cb0011575b08b2'); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
