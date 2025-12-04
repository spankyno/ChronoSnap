import { Redis } from '@upstash/redis';

// Initialize Redis from environment variables
// Vercel automatically populates KV_REST_API_URL and KV_REST_API_TOKEN 
// or UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN when you connect the integration.
const redis = Redis.fromEnv();

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract IP address from headers
    // x-forwarded-for is standard on Vercel for the client IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const timestamp = new Date().toISOString();

    const logEntry = {
      ip,
      timestamp,
      userAgent
    };

    // Push the log entry to a Redis list called 'access_logs'
    await redis.lpush('access_logs', JSON.stringify(logEntry));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Redis logging error:', error);
    return res.status(500).json({ error: 'Failed to log visit' });
  }
}