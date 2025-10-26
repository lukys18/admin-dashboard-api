// Vercel Serverless Function pre Supabase config
export default function handler(req, res) {
  // Nastav CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/javascript');

  // Vráť JavaScript kód s config
  const script = `
window.SUPABASE_CONFIG = {
    url: "${process.env.SUPABASE_URL}",
    anonKey: "${process.env.SUPABASE_ANON_KEY}"
};
`;

  res.status(200).send(script);
}
