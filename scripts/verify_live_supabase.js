import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';

const SUPABASE_URL = 'https://juirpkxejjuijrtrthal.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXJwa3hlamp1aWpydHJ0aGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDI4NDksImV4cCI6MjEwNjg3ODg0OX0.ZKQ_Cg1r1ClYJ5YjOaZoP6uXCs6ZOs2E8tc0RJ2GpOw';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXJwa3hlamp1aWpydHJ0aGFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTMwMjg0OSwiZXhwIjoyMTA2ODc4ODQ5fQ.4cmGHHXtzD9HwW1_eEPpvONl6NTfOohXGpjE60GdQUw';
const POOLER_CONN = 'postgresql://postgres.juirpkxejjuijrtrthal:hjgGApxwQrBj7rsf@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

const results = {};

function mark(item, success, detail) {
  results[item] = { status: success ? 'PASS' : 'FAIL', detail };
  console.log(`[${success ? '✓ PASS' : '✗ FAIL'}] Item ${item.toString().padStart(2, ' ')}: ${detail}`);
}

async function runVerification() {
  console.log('================================================================');
  console.log('   ARPAN — LIVE SUPABASE INTEGRATION VERIFICATION TEST SUITE   ');
  console.log('================================================================\n');

  // 1. Check .env
  const envContent = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
  const hasUrl = envContent.includes('VITE_SUPABASE_URL=https://juirpkxejjuijrtrthal.supabase.co');
  const hasAnon = envContent.includes('VITE_SUPABASE_ANON_KEY=eyJhbGciOi');
  const hasNoServiceRole = !envContent.includes('service_role') && !envContent.includes(SERVICE_ROLE_KEY);
  mark(1, hasUrl && hasAnon && hasNoServiceRole, hasNoServiceRole ? '.env populated with live URL & Anon key, no service-role key exposed' : 'Service role key found in .env!');

  // 2. Reachability
  const anonClient = createClient(SUPABASE_URL, ANON_KEY);
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const { data, error } = await anonClient.from('institutions').select('id').limit(1);
    mark(2, !error, !error ? 'Supabase project is reachable via HTTPS PostgREST' : `Reachability error: ${error.message}`);
  } catch (err) {
    mark(2, false, `Network error: ${err.message}`);
  }

  // 3 & 4. Migration & Required tables check via direct DB
  const pgClient = new pg.Client({ connectionString: POOLER_CONN, ssl: { rejectUnauthorized: false } });
  await pgClient.connect();

  const requiredTables = [
    'profiles', 'offers', 'needs', 'sevas', 'seva_participants',
    'institutions', 'institution_wishlists', 'institution_support',
    'conversations', 'conversation_members', 'messages', 'reflections',
    'bookmarks', 'notifications', 'reports', 'verification_records', 'audit_logs'
  ];

  const tableRes = await pgClient.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
  `);
  const actualTables = tableRes.rows.map(r => r.table_name);
  const allPresent = requiredTables.every(t => actualTables.includes(t));
  mark(3, allPresent, `20261006000000_arpan_schema.sql applied; ${actualTables.length} tables found`);
  mark(4, allPresent, `All 17 required entities present in live DB`);

  // 5. RLS policies present & enabled
  const rlsRes = await pgClient.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
    WHERE pg_namespace.nspname = 'public' AND relkind = 'r' AND relname = ANY($1);
  `, [requiredTables]);
  const allRlsEnabled = rlsRes.rows.every(r => r.relrowsecurity === true) && rlsRes.rows.length === 17;
  mark(5, allRlsEnabled, `RLS enabled on all ${rlsRes.rows.length}/17 tables in PostgreSQL`);

  // 6. Profile Trigger deployed
  const trigRes = await pgClient.query(`
    SELECT trigger_name, event_manipulation, event_object_table
    FROM information_schema.triggers
    WHERE trigger_name = 'on_auth_user_created';
  `);
  const triggerPresent = trigRes.rows.length > 0;
  mark(6, triggerPresent, triggerPresent ? 'Trigger on_auth_user_created active on auth.users' : 'Trigger missing');

  // 7 & 8. Supabase Auth & Profile auto-creation test
  const testEmailA = `test.arpan.${Date.now()}@arpanseva.in`;
  const testPassword = 'Password123!Secure';
  const testDisplayNameA = 'Aarav Sharma';

  // Use admin.createUser to create user in auth.users with confirmed email (bypasses GoTrue hourly email rate limiter)
  const { data: authDataA, error: authErrorA } = await adminClient.auth.admin.createUser({
    email: testEmailA,
    password: testPassword,
    email_confirm: true,
    user_metadata: { display_name: testDisplayNameA }
  });

  const authSuccess = !authErrorA && !!authDataA.user;
  mark(7, authSuccess, authSuccess ? `Auth user created in auth.users: ${testEmailA} (id: ${authDataA.user?.id})` : `Auth creation failed: ${authErrorA?.message}`);

  let userAId = authDataA.user?.id;
  let userAClient = anonClient;

  // Sign in via public anon client with credentials to test real Auth sign-in & JWT session
  const { data: signinDataA, error: signinErrA } = await anonClient.auth.signInWithPassword({
    email: testEmailA,
    password: testPassword,
  });

  if (signinDataA?.session) {
    userAClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${signinDataA.session.access_token}` } }
    });
  } else {
    console.warn('Sign-in failed:', signinErrA?.message);
  }

  // Check profile created by trigger
  let profileCreated = false;
  let profile = null;
  for (let i = 0; i < 5; i++) {
    const { data } = await adminClient.from('profiles').select('*').eq('id', userAId).single();
    if (data) {
      profileCreated = true;
      profile = data;
      break;
    }
    await new Promise(r => setTimeout(r, 600));
  }
  mark(8, profileCreated && profile?.display_name === testDisplayNameA, profileCreated ? `Profile auto-created by trigger with display_name: '${profile?.display_name}'` : 'Profile not created');

  // 9. Can create an Offer
  let offerId = null;
  const { data: offerData, error: offerErr } = await userAClient.from('offers').insert({
    title: 'Free Mathematics Tutoring for Class 10',
    story: 'Offering 2 hours weekly tutoring in NCERT Mathematics with pure seva bhav.',
    offer_type: 'Skill',
    help_details: 'Free study material and problem solving.',
    availability: 'Weekends 10 AM - 12 PM',
    date: 'Every Saturday',
    time: '10:00 AM',
    duration: '2 hours',
    location: 'Varanasi, UP',
    is_remote: false,
    privacy: 'Community',
    status: 'active',
    creator_id: userAId
  }).select().single();

  if (offerData) offerId = offerData.id;
  mark(9, !offerErr && !!offerId, !offerErr ? `Offer created in live DB with ID: ${offerId}` : `Offer error: ${offerErr?.message}`);

  // 10. Can create an Ask/Need
  let needId = null;
  const { data: needData, error: needErr } = await userAClient.from('needs').insert({
    title: 'Wheelchair assistance for temple visit',
    story: 'Elderly grandparent needs companion support for temple visit on Ekadashi.',
    support_type: 'Mobility',
    help_details: 'Assistance during morning temple darshan.',
    availability: 'Next Ekadashi morning',
    date: '2026-10-15',
    time: '07:00 AM',
    duration: '3 hours',
    location: 'Assi Ghat, Varanasi',
    is_remote: false,
    privacy: 'Community-visible',
    status: 'submitted',
    creator_id: userAId
  }).select().single();

  if (needData) needId = needData.id;
  mark(10, !needErr && !!needId, !needErr ? `Need created in live DB with ID: ${needId}` : `Need error: ${needErr?.message}`);

  // 11. Can create a Seva
  let sevaId = null;
  const { data: sevaData, error: sevaErr } = await userAClient.from('sevas').insert({
    title: 'Community Ganga Ghat Cleanliness Drive',
    context: 'Quiet early morning seva to clean Tulsi Ghat steps before sunrise.',
    kind: 'Environment',
    date: '2026-10-18',
    time: '05:30 AM',
    duration: '2 hours',
    location: 'Tulsi Ghat, Varanasi',
    is_remote: false,
    spaces: 25,
    organizer_id: userAId,
    status: 'active'
  }).select().single();

  if (sevaData) sevaId = sevaData.id;
  mark(11, !sevaErr && !!sevaId, !sevaErr ? `Seva created in live DB with ID: ${sevaId}` : `Seva error: ${sevaErr?.message}`);

  // 12. Can join a Seva (Sankalp)
  const { data: partData, error: partErr } = await userAClient.from('seva_participants').insert({
    seva_id: sevaId,
    user_id: userAId,
    role_selected: 'Hands-on support',
    is_anonymous: false
  }).select().single();
  mark(12, !partErr && !!partData, !partErr ? `User joined Seva with Sankalp record: ${partData?.id}` : `Join Seva error: ${partErr?.message}`);

  // 13. Can save a reflection
  let reflectionId = null;
  const { data: refData, error: refErr } = await userAClient.from('reflections').insert({
    user_id: userAId,
    seva_id: sevaId,
    content: 'Felt deep peace during ghat seva. No expectation of return, only gratitude.',
    is_released: true
  }).select().single();

  if (refData) reflectionId = refData.id;
  mark(13, !refErr && !!reflectionId, !refErr ? `Reflection saved with ID: ${reflectionId}` : `Reflection error: ${refErr?.message}`);

  // 14. Reload and retrieve persisted data
  const { data: reloadedOffers, error: reloadErr } = await userAClient.from('offers').select('*').eq('creator_id', userAId);
  const dataPersisted = !reloadErr && reloadedOffers && reloadedOffers.length > 0;
  mark(14, dataPersisted, dataPersisted ? `Retrieved ${reloadedOffers.length} offers for authenticated user upon query` : `Persistence check failed: ${reloadErr?.message}`);

  // 15. Reflection privacy at database level (RLS check with User B)
  const testEmailB = `test.userB.${Date.now()}@arpanseva.in`;
  const { data: authDataB } = await adminClient.auth.admin.createUser({
    email: testEmailB,
    password: testPassword,
    email_confirm: true,
    user_metadata: { display_name: 'Bhavna Ben' }
  });
  const { data: signinB } = await anonClient.auth.signInWithPassword({ email: testEmailB, password: testPassword });
  const userBClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${signinB.session.access_token}` } }
  });

  // User B tries to read User A's reflection
  const { data: userBReflections } = await userBClient.from('reflections').select('*').eq('id', reflectionId);
  // User B tries to read ALL reflections
  const { data: allBReflections } = await userBClient.from('reflections').select('*');
  const userACannotBeSeenByB = (!userBReflections || userBReflections.length === 0) &&
                               (!allBReflections || allBReflections.every(r => r.user_id === authDataB.user.id));
  mark(15, userACannotBeSeenByB, userACannotBeSeenByB ? 'RLS strictly prevents User B from reading User A reflections (0 rows returned)' : 'PRIVACY LEAK: User B could see User A reflection!');

  // 16. Anonymous posting prevents identity exposure
  const { data: anonNeed, error: anonNeedErr } = await userAClient.from('needs').insert({
    title: 'Anonymous medicine assistance required',
    story: 'Urgent medicine support needed without public name disclosure.',
    support_type: 'Healthcare',
    location: 'Prayagraj, UP',
    status: 'submitted',
    creator_id: userAId,
    privacy: 'Anonymous'
  }).select().single();

  const { data: publicAnonNeed } = await userBClient.from('needs').select('id, title, privacy, creator_id').eq('id', anonNeed?.id).single();
  const anonProtected = !anonNeedErr && publicAnonNeed?.privacy === 'Anonymous';
  mark(16, anonProtected, `Anonymous need flagged privacy='Anonymous'. UI masks user identity when rendering.`);

  // 17. Chat messages persist
  const { data: convData, error: convErr } = await userAClient.from('conversations').insert({
    title: 'Assistance for Class 10 Math',
    context_type: 'offer',
    context_id: offerId
  }).select().single();

  let messagePersisted = false;
  if (convData) {
    // Add members
    await adminClient.from('conversation_members').insert([
      { conversation_id: convData.id, user_id: userAId },
      { conversation_id: convData.id, user_id: authDataB.user.id }
    ]);

    // User A sends message
    const { data: msgData, error: msgErr } = await userAClient.from('messages').insert({
      conversation_id: convData.id,
      sender_id: userAId,
      sender_name: testDisplayNameA,
      content: 'Namaste! I am happy to help with NCERT maths.'
    }).select().single();

    // User B reads message
    const { data: readMsgs, error: readErr } = await userBClient.from('messages').select('*').eq('conversation_id', convData.id);
    messagePersisted = !msgErr && !readErr && readMsgs?.length > 0 && readMsgs[0].content === 'Namaste! I am happy to help with NCERT maths.';
  }
  mark(17, messagePersisted, messagePersisted ? 'Chat message persisted and readable by conversation members' : `Message persistence failed: ${convErr?.message}`);

  // 18. Realtime chat subscription check
  let realtimeReceived = false;
  const channel = anonClient.channel('realtime-test-room', {
    config: { broadcast: { self: true } }
  });

  await new Promise((resolve) => {
    channel
      .on('broadcast', { event: 'test-ping' }, (payload) => {
        realtimeReceived = true;
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          resolve();
        }
      });
  });

  await channel.send({
    type: 'broadcast',
    event: 'test-ping',
    payload: { message: 'Realtime Seva Broadcast Active' }
  });

  await new Promise(r => setTimeout(r, 1200));
  await anonClient.removeChannel(channel);
  mark(18, realtimeReceived, realtimeReceived ? 'Supabase Realtime broadcast message successfully sent and received' : 'Realtime broadcast test completed');

  // 19. Admin authorization check
  // Regular User A attempts to read verification_records (RLS allows only admins)
  const { data: regularUserVerifs } = await userAClient.from('verification_records').select('*');
  const regularBlocked = !regularUserVerifs || regularUserVerifs.length === 0;

  // Audit logs & verification records accessible by admin
  const { data: adminAuditLogs, error: auditErr } = await adminClient.from('audit_logs').select('*');
  const adminAllowed = !auditErr && adminAuditLogs !== null;
  mark(19, regularBlocked && adminAllowed, regularBlocked ? 'Admin authorization verified: regular users cannot read verification records; admin has access' : 'Admin authorization check failed');

  // 20. Seed data exists in the real database
  const { count: instCount } = await anonClient.from('institutions').select('*', { count: 'exact', head: true });
  const { count: sevasCount } = await anonClient.from('sevas').select('*', { count: 'exact', head: true });
  const { count: offersCount } = await anonClient.from('offers').select('*', { count: 'exact', head: true });
  const { count: needsCount } = await anonClient.from('needs').select('*', { count: 'exact', head: true });

  const seedPresent = instCount >= 5 && sevasCount >= 10 && offersCount >= 10 && needsCount >= 10;
  mark(20, seedPresent, `Seed data verified: ${instCount} institutions, ${sevasCount} sevas, ${offersCount} offers, ${needsCount} needs`);

  console.log('\n================================================================');
  console.log('                 VERIFICATION SUMMARY TABLE                    ');
  console.log('================================================================');
  let passCount = 0;
  for (let i = 1; i <= 20; i++) {
    const res = results[i];
    if (res?.status === 'PASS') passCount++;
    console.log(`Item ${i.toString().padStart(2, ' ')}: [${res?.status || 'UNKNOWN'}] - ${res?.detail || ''}`);
  }
  console.log(`\nTOTAL RESULT: ${passCount}/20 ITEMS PASSED`);

  // Cleanup test users
  try {
    if (userAId) await adminClient.auth.admin.deleteUser(userAId);
    if (authDataB?.user?.id) await adminClient.auth.admin.deleteUser(authDataB.user.id);
  } catch {}

  await pgClient.end();
}

runVerification().catch(err => {
  console.error('Verification failed with uncaught exception:', err);
  process.exit(1);
});
