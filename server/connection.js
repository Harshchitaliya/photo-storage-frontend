const admin = require('firebase-admin');
const serviceAccount = require('./firebaseconfig.json'); // Path to your Firebase config JSON file

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Export the initialized admin instance along with Firestore, Auth, and Storage
const db = admin.firestore(); // Firestore database
const auth = admin.auth(); // Authentication
const storage = admin.storage(); // Storage

module.exports = { admin, db, auth, storage }; // Export the admin, db, auth, and storage instances
