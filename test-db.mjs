import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://juirpkxejjuijrtrthal.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXJwa3hlamp1aWpydHJ0aGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDI4NDksImV4cCI6MjEwNjg3ODg0OX0.ZKQ_Cg1r1ClYJ5YjOaZoP6uXCs6ZOs2E8tc0RJ2GpOw');
async function run() {
  const { data, error } = await supabase.from('offers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Delete offers:', error ? error.message : 'Success');
}
run();
