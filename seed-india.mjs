import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://juirpkxejjuijrtrthal.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXJwa3hlamp1aWpydHJ0aGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDI4NDksImV4cCI6MjEwNjg3ODg0OX0.ZKQ_Cg1r1ClYJ5YjOaZoP6uXCs6ZOs2E8tc0RJ2GpOw');

async function run() {
  console.log('Deleting old data...');
  await supabase.from('offers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('needs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sevas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('institutions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('Inserting institutions...');
  await supabase.from('institutions').insert([
    {
      title: 'Aashray Care Home',
      context: 'Providing dignified shelter and medical care for the elderly without families in North Delhi.',
      category: 'Elder Care',
      location: 'Delhi',
      verified: true,
      status: 'active'
    },
    {
      title: 'Vidya Foundation',
      context: 'Empowering children in rural Maharashtra through after-school tutoring and digital literacy.',
      category: 'Education',
      location: 'Pune',
      verified: true,
      status: 'active'
    },
    {
      title: 'Annapurna Seva Trust',
      context: 'A community kitchen serving 500 hot meals daily to daily wage workers and homeless individuals.',
      category: 'Food',
      location: 'Mumbai',
      verified: true,
      status: 'active'
    },
    {
      title: 'Sahaya Animal Rescue',
      context: 'A dedicated team rehabilitating injured stray dogs and cats across the city.',
      category: 'Environment',
      location: 'Chennai',
      verified: true,
      status: 'active'
    }
  ]);

  console.log('Inserting sevas...');
  await supabase.from('sevas').insert([
    {
      kind: 'Education',
      title: 'Weekend Mentorship at Vidya',
      context: 'Spend two hours helping class 8 students with mathematics and basic English. Patience is more important than expertise.',
      date: '2026-10-15',
      time: '10:00 AM',
      duration: '2 hours',
      location: 'Pune',
      is_remote: false,
      spaces: 10,
      recurring: true,
      verified: true,
      status: 'active'
    },
    {
      kind: 'Environment',
      title: 'Lalbagh Lake Clean-up',
      context: 'Join hands with local environmentalists to remove plastic waste from the lake perimeter and restore the local ecosystem.',
      date: '2026-10-18',
      time: '07:00 AM',
      duration: '3 hours',
      location: 'Bengaluru',
      is_remote: false,
      spaces: 25,
      recurring: false,
      verified: true,
      status: 'active'
    },
    {
      kind: 'Elder Care',
      title: 'Evening Conversations',
      context: 'Sit with the residents of Aashray Care Home, listen to their stories, and share a cup of tea. Just your presence is needed.',
      date: '2026-10-20',
      time: '04:00 PM',
      duration: '1.5 hours',
      location: 'Delhi',
      is_remote: false,
      spaces: 5,
      recurring: true,
      verified: true,
      status: 'active'
    },
    {
      kind: 'Food',
      title: 'Roti Rolling Seva',
      context: 'Help the Annapurna kitchen by rolling rotis for the afternoon lunch service. Clean aprons provided.',
      date: '2026-10-22',
      time: '09:00 AM',
      duration: '3 hours',
      location: 'Mumbai',
      is_remote: false,
      spaces: 15,
      recurring: true,
      verified: true,
      status: 'active'
    },
    {
      kind: 'Skill Sharing',
      title: 'Digital Literacy for Seniors',
      context: 'Help older adults navigate WhatsApp, UPI payments, and basic smartphone settings safely.',
      date: '2026-10-25',
      time: '11:00 AM',
      duration: '2 hours',
      location: 'Online',
      is_remote: true,
      spaces: 8,
      recurring: true,
      verified: true,
      status: 'active'
    }
  ]);

  console.log('Inserting offers...');
  await supabase.from('offers').insert([
    {
      offer_type: 'Skill',
      title: 'I can help with NGO accounting and GST filing',
      story: 'I am a chartered accountant with 5 years of experience. I want to help small non-profits set up their books properly.',
      location: 'Online',
      is_remote: true,
      privacy: 'Public',
      status: 'active',
      verified: true
    },
    {
      offer_type: 'Time',
      title: 'Driving patients to hospitals',
      story: 'I have a car and free time on Tuesday mornings. I can drive elderly patients to their hospital appointments safely in Chennai.',
      location: 'Chennai',
      is_remote: false,
      privacy: 'Community',
      status: 'active',
      verified: true
    },
    {
      offer_type: 'Knowledge',
      title: 'Career counselling for IT jobs',
      story: 'I work in a tech firm and can guide final year students from tier-3 colleges on interview preparation and resume building.',
      location: 'Online',
      is_remote: true,
      privacy: 'Public',
      status: 'active',
      verified: true
    },
    {
      offer_type: 'Resources',
      title: 'Donating 3 slightly used laptops',
      story: 'My company recently upgraded hardware. We have 3 fully functional Lenovo laptops perfect for students learning to code.',
      location: 'Hyderabad',
      is_remote: false,
      privacy: 'Public',
      status: 'active',
      verified: true
    },
    {
      offer_type: 'Knowledge',
      title: 'Free classical music lessons for kids',
      story: 'I can teach basic Carnatic vocal music to children who are interested but cannot afford formal training.',
      location: 'Bengaluru',
      is_remote: false,
      privacy: 'Public',
      status: 'active',
      verified: true
    }
  ]);

  console.log('Inserting needs...');
  await supabase.from('needs').insert([
    {
      support_type: 'Healthcare',
      title: 'Need help sourcing specific asthma medication',
      story: 'My grandmother needs a specific inhaler that is currently out of stock in my local pharmacies in Koramangala. If anyone can help procure it, I will reimburse.',
      location: 'Bengaluru',
      is_remote: false,
      privacy: 'Public',
      consent_given: true,
      status: 'verified',
      verified: true
    },
    {
      support_type: 'Education',
      title: 'Looking for a Hindi tutor for class 10',
      story: 'My son is struggling with his Hindi board exam preparations and we cannot afford private tuitions right now. Two hours a week would be a blessing.',
      location: 'Delhi',
      is_remote: false,
      privacy: 'Community-visible',
      consent_given: true,
      status: 'verified',
      verified: true
    },
    {
      support_type: 'Mobility',
      title: 'Wheelchair needed for an uncle',
      story: 'My uncle recently had a minor accident and requires a wheelchair for about 3 months. Does anyone have a spare one we can borrow?',
      location: 'Pune',
      is_remote: false,
      privacy: 'Public',
      consent_given: true,
      status: 'verified',
      verified: true
    },
    {
      support_type: 'Technology',
      title: 'Need help building a website for our NGO',
      story: 'We are a small animal rescue team and need a simple 3-page website to collect donations and share adoption stories. We have all the content ready.',
      location: 'Online',
      is_remote: true,
      privacy: 'Public',
      consent_given: true,
      status: 'verified',
      verified: true
    },
    {
      support_type: 'Food',
      title: 'Ration kits needed for daily wage workers',
      story: 'A small community of daily wage workers in our area is struggling due to recent heavy rains halting construction work. Seeking 20 basic dry ration kits.',
      location: 'Mumbai',
      is_remote: false,
      privacy: 'Public',
      consent_given: true,
      status: 'verified',
      verified: true
    }
  ]);

  console.log('Done!');
}
run();
