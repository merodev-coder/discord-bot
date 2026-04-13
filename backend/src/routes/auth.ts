import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = Router();

const DISCORD_API = 'https://discord.com/api/v10';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://discord-bot-bt70.onrender.com/api/auth/discord/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ultimatebot.netlify.app';

router.get('/discord', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

router.get('/discord/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
  }

  try {
    const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.redirect(`${FRONTEND_URL}/login?error=token_failed`);
    }

    const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();

    await User.findByIdAndUpdate(
      userData.id,
      {
        _id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator || '0',
        avatar: userData.avatar,
        email: userData.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      },
      { upsert: true, new: true }
    );

    const jwtToken = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        avatar: userData.avatar,
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Pass token via URL — cookies don't work cross-domain (Netlify ↔ Render)
    res.redirect(`${FRONTEND_URL}/dashboard?token=${jwtToken}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { id: string };
    const user = await User.findById(decoded.id).select('username avatar premium');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const fullUser = await User.findById(decoded.id).select('accessToken');
    const accessToken = fullUser?.accessToken;

    let guilds: any[] = [];
    if (accessToken) {
      const guildsResponse = await fetch(`${DISCORD_API}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (guildsResponse.ok) {
        const allGuilds = await guildsResponse.json();
        // Return guilds where user is owner, has ADMINISTRATOR (0x8), or MANAGE_GUILD (0x20)
        const manageable = allGuilds.filter((g: any) => {
          if (g.owner) return true;
          const perms = Number(g.permissions);
          return (perms & 0x8) === 0x8 || (perms & 0x20) === 0x20;
        });

        // Import bot client to check which guilds the bot is in
        let botGuildIds = new Set<string>();
        try {
          const { default: botClient } = await import('../bot/index.js');
          if (botClient?.isReady?.()) {
            botGuildIds = new Set(botClient.guilds.cache.keys());
          }
        } catch (e) {
          console.warn('Could not read bot guild cache:', e);
        }

        guilds = manageable.map((g: any) => ({
          id: g.id,
          name: g.name,
          icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
          botIn: botGuildIds.size > 0 ? botGuildIds.has(g.id) : true,
        }));
      }
    }

    res.json({ user: { id: user._id, username: user.username, avatar: user.avatar, premium: user.premium }, guilds });
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

export default router;
