const { Client, Databases, ID } = require('node-appwrite');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async ({ req, res, log, error }) => {
    // 1. Initialize Appwrite Client
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);

    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            const { name, enrollment_no, feedback } = body;

            if (!name || !enrollment_no || !feedback) {
                return res.json({ success: false, message: 'Missing required fields' }, 400);
            }

            // 2. Save to Appwrite Database
            const document = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    name,
                    enrollment_no,
                    feedback,
                    created_at: new Date().toISOString()
                }
            );

            log(`Record saved to Appwrite: ${document.$id}`);

            // 3. Append to Google Sheets
            const serviceAccountAuth = new JWT({
                email: process.env.GOOGLE_CLIENT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            log('Appending row to sheet...');
            await sheet.addRow({
                'Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                'Name': name,
                'Enrollment Number': enrollment_no,
                'Feedback': feedback
            });

            log('Record appended to Google Sheet successfully');

            return res.json({
                success: true,
                message: 'Feedback processed successfully',
                data: { name, enrollment_no }
            });

        } catch (err) {
            error(`Function Error: ${err.message}`);
            return res.json({ success: false, message: err.message }, 500);
        }
    }

    return res.json({ message: 'Triggered by event or manual execution' }, 200);
};
