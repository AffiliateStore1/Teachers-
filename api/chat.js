// api/chat.js

import fetch from 'node-fetch';

export default async function handler(request, response) {
  // 1. API Key को Vercel Environment Variable से सुरक्षित रूप से लोड करें
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

  if (!OPENROUTER_API_KEY) {
    return response.status(500).json({ 
      error: "Server Error: OPENROUTER_API_KEY environment variable is not configured." 
    });
  }
  
  if (request.method !== 'POST') {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages, model, user } = request.body; 

    // 2. OpenRouter API को Server-side से call करें
    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`, // Key का उपयोग केवल यहीं हो रहा है!
        "HTTP-Referer": request.headers['x-forwarded-proto'] + '://' + request.headers['host'], 
        "X-Title": "All Teachers Chat App (Vercel Proxy)", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model, 
        messages,
        user 
      }),
    });

    // 3. OpenRouter से प्राप्त response को client को भेज दें
    const data = await apiResponse.json();
    response.status(apiResponse.status).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    response.status(500).json({ error: "Internal Server Error during OpenRouter API call." });
  }
}
