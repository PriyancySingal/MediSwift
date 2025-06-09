const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Load Firebase service account
const serviceAccount = require('./firebase-adminsdk.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Protect this route
app.post('/api/sync-user', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).send({ error: 'No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: req.body.name,
    };

    // TODO: Save to your DB — right now just log it
    console.log('✅ Verified Firebase User:', { uid, email, name });

    res.status(200).send({ success: true, uid, email });
  } catch (err) {
    console.error('❌ Token verification failed:', err);
    res.status(403).send({ error: 'Unauthorized' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
