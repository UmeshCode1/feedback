import { Client, Account, Databases } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6952d5ec002e7079076f");

const account = new Account(client);
const databases = new Databases(client);

// Ping the Appwrite backend server to verify the setup
if (typeof window !== "undefined") {
    client.ping()
        .then(() => console.log("Appwrite connection verified"))
        .catch((err) => console.error("Appwrite connection failed:", err));
}

export { client, account, databases };
