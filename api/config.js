// Vercel API - Auth endpoint
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password } = req.body;

  try {
    switch (action) {
      case 'login':
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (loginError) throw loginError;
        
        return res.status(200).json({ 
          success: true, 
          session: loginData.session,
          user: loginData.user 
        });

      case 'logout':
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          await supabase.auth.signOut();
        }
        return res.status(200).json({ success: true });

      case 'getSession':
        const authToken = req.headers.authorization?.replace('Bearer ', '');
        if (!authToken) {
          return res.status(401).json({ error: 'No token' });
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser(authToken);
        if (userError) throw userError;
        
        return res.status(200).json({ success: true, user });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
