import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = 'aimlclub_feedback';
const COLLECTION_ID = 'feedback_entries';

async function setup() {
    try {
        console.log('Creating Database...');
        await databases.create(DATABASE_ID, 'AIML Club Feedback');
        console.log('Database created.');

        console.log('Creating Collection...');
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Feedback Entries',
            [
                Permission.create(Role.any()), // Anyone can submit feedback
                Permission.read(Role.team('admin')),
                Permission.update(Role.team('admin')),
                Permission.delete(Role.team('admin')),
            ]
        );
        console.log('Collection created.');

        console.log('Creating Attributes...');
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'name', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'enrollment_no', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'feedback', 2000, true);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, 'created_at', true);
        
        console.log('Appwrite Setup Complete!');
    } catch (error: any) {
        console.error('Error during setup:', error.message);
    }
}

setup();
