const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Create test users if they don't exist
    const testUsers = [
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'demo@piensa.com', password: 'demo123' },
    ];

    const results = [];
    
    for (const user of testUsers) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              username: user.email.split('@')[0]
            }
          }
        });

        if (error && !error.message.includes('already registered')) {
          console.error(`Error creating user ${user.email}:`, error);
          results.push({ email: user.email, error: error.message });
        } else {
          results.push({ email: user.email, success: true });
        }
      } catch (err) {
        console.error(`Exception creating user ${user.email}:`, err);
        results.push({ email: user.email, error: err.message });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Setup completed',
        results: results
      }),
    };

  } catch (error) {
    console.error('Setup error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};