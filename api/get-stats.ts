import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the last 100 logs. 0 is the start, 99 is the 100th element.
    const rawLogs = await redis.lrange('access_logs', 0, 99);
    
    // Parse strings back to objects (Redis stores JSON strings)
    const logs = rawLogs.map((log: any) => {
        try {
            return typeof log === 'string' ? JSON.parse(log) : log;
        } catch (e) {
            return { ip: 'error', timestamp: new Date().toISOString(), userAgent: 'Parse Error' };
        }
    });

    return res.status(200).json({ logs });
  } catch (error) {
    console.error('Redis fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}