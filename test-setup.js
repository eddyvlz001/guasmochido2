const { handler } = require('./src/functions/setup.js');

// Set environment variables
process.env.SUPABASE_URL = 'https://euwcqesokyajfnapyntf.supabase.co';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1d2NxZXNva3lhamZuYXB5bnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTE1NTksImV4cCI6MjA2ODg4NzU1OX0.ojdmRlUhCApL0nZqt_3Zsgt5sODleOt5jg3S488gr7Q';

// Mock event
const event = {
  httpMethod: 'POST',
  body: JSON.stringify({})
};

// Test the setup function
handler(event)
  .then(response => {
    console.log('Setup response:', response);
    console.log('Body:', JSON.parse(response.body));
  })
  .catch(error => {
    console.error('Error:', error);
  });