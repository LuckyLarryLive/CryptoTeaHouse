import { Router } from 'express';
import { google } from 'googleapis';
import { prisma } from '../lib/prisma';
import { generateToken } from '../lib/jwt';

const router = Router();

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://cryptoteahouse.com'
);

// Google authentication endpoint
router.post('/google', async (req, res) => {
  try {
    const { access_token, user_info } = req.body;

    if (!access_token || !user_info) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify the access token with Google
    oauth2Client.setCredentials({ access_token });
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Verify that the user info matches
    if (data.email !== user_info.email) {
      return res.status(401).json({ error: 'Invalid user information' });
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { email: user_info.email },
      update: {
        name: user_info.name,
        picture: user_info.picture,
        lastLogin: new Date(),
      },
      create: {
        email: user_info.email,
        name: user_info.name,
        picture: user_info.picture,
        provider: 'google',
        lastLogin: new Date(),
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    res.json({
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router; 