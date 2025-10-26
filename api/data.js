// Vercel API - Data endpoint
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify authentication
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { action, table, data: bodyData } = req.body || {};

  try {
    switch (action) {
      case 'getUserData':
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        return res.status(200).json({ success: true, data: userData });

      case 'getChatLogs':
        const { data: logsData, error: logsError } = await supabase
          .from('chat_logs')
          .select('*')
          .eq('website', bodyData.website);
        
        if (logsError) throw logsError;
        return res.status(200).json({ success: true, data: logsData });

      case 'updateLastLogin':
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);
        
        if (updateError) throw updateError;
        return res.status(200).json({ success: true });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
