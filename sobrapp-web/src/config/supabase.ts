import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hoaaxypkjegbqclnzmyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvYWF4eXBramVnYnFjbG56bXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDEyMjcsImV4cCI6MjA2OTkxNzIyN30.dhNXv7H47Rxh6HMS4sAdDpMg8__FrWRtWAgi7plt8Yo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Error conectando a Supabase:', error);
      return false;
    }
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error en testConnection:', error);
    return false;
  }
}; 