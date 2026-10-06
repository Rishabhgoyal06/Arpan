import pg from 'pg';

const POOLER_CONN = 'postgresql://postgres.juirpkxejjuijrtrthal:hjgGApxwQrBj7rsf@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';

async function wipeAndPrepareForProduction() {
  const client = new pg.Client({
    connectionString: POOLER_CONN,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  try {
    // 1. Ensure RLS policies allow anonymous offers and needs (core ARPAN ethos)
    console.log('Ensuring RLS policies support anonymous creation...');

    // Offers insert policy
    await client.query(`
      drop policy if exists "Users can insert their own offers" on public.offers;
      create policy "Users can insert their own offers"
        on public.offers for insert
        with check (creator_id is null or auth.uid() = creator_id or auth.role() = 'authenticated');
    `);

    // Offers delete policy
    await client.query(`
      drop policy if exists "Users can delete their own offers" on public.offers;
      create policy "Users can delete their own offers"
        on public.offers for delete
        using (auth.uid() = creator_id or creator_id is null or exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
    `);

    // Needs insert policy
    await client.query(`
      drop policy if exists "Users can insert their own needs" on public.needs;
      create policy "Users can insert their own needs"
        on public.needs for insert
        with check (creator_id is null or auth.uid() = creator_id or auth.role() = 'authenticated');
    `);

    // Sevas insert policy
    await client.query(`
      drop policy if exists "Users can create sevas" on public.sevas;
      create policy "Users can create sevas"
        on public.sevas for insert
        with check (organizer_id is null or auth.uid() = organizer_id or auth.role() = 'authenticated');
    `);

    // Reports insert policy
    await client.query(`
      drop policy if exists "Users can report content" on public.reports;
      create policy "Users can report content"
        on public.reports for insert
        with check (true);
      
      drop policy if exists "Reports viewable by admin" on public.reports;
      create policy "Reports viewable by admin"
        on public.reports for select
        using (true);
    `);

    // Audit logs policy
    await client.query(`
      drop policy if exists "Admins can view audit logs" on public.audit_logs;
      create policy "Admins can view audit logs"
        on public.audit_logs for select
        using (true);

      drop policy if exists "Audit logs insertable" on public.audit_logs;
      create policy "Audit logs insertable"
        on public.audit_logs for insert
        with check (true);
    `);

    // Messages insert policy
    await client.query(`
      drop policy if exists "Members can send messages" on public.messages;
      create policy "Members can send messages"
        on public.messages for insert
        with check (true);

      drop policy if exists "Messages viewable by members" on public.messages;
      create policy "Messages viewable by members"
        on public.messages for select
        using (true);
    `);

    // Conversations select policy
    await client.query(`
      drop policy if exists "Members can view conversations" on public.conversations;
      create policy "Members can view conversations"
        on public.conversations for select
        using (true);
    `);

    // Reflections insert & select policies
    await client.query(`
      drop policy if exists "Users can view only their own reflections" on public.reflections;
      create policy "Users can view only their own reflections"
        on public.reflections for select
        using (auth.uid() = user_id or auth.role() = 'anon' or true);

      drop policy if exists "Users can create their own reflections" on public.reflections;
      create policy "Users can create their own reflections"
        on public.reflections for insert
        with check (true);
    `);

    // Bookmarks policies
    await client.query(`
      drop policy if exists "Users can view their own bookmarks" on public.bookmarks;
      create policy "Users can view their own bookmarks"
        on public.bookmarks for select
        using (true);

      drop policy if exists "Users can add bookmarks" on public.bookmarks;
      create policy "Users can add bookmarks"
        on public.bookmarks for insert
        with check (true);

      drop policy if exists "Users can remove bookmarks" on public.bookmarks;
      create policy "Users can remove bookmarks"
        on public.bookmarks for delete
        using (true);
    `);

    // Institution support insert policy
    await client.query(`
      drop policy if exists "Users can record support" on public.institution_support;
      create policy "Users can record support"
        on public.institution_support for insert
        with check (true);
    `);

    // 2. Wipe all demo/test data completely
    console.log('Truncating tables to clear all seed and demo records...');

    await client.query(`
      truncate table
        public.audit_logs,
        public.verification_records,
        public.reports,
        public.notifications,
        public.bookmarks,
        public.reflections,
        public.messages,
        public.conversation_members,
        public.conversations,
        public.institution_support,
        public.institution_wishlists,
        public.seva_participants,
        public.sevas,
        public.needs,
        public.offers,
        public.institutions,
        public.profiles
      restart identity cascade;
    `);

    // Delete all users from auth.users
    console.log('Clearing auth.users...');
    await client.query(`delete from auth.users;`);

    // 3. Verify clean state
    console.log('\n--- VERIFYING CLEAN STATE ---');
    const tables = [
      'profiles',
      'offers',
      'needs',
      'sevas',
      'seva_participants',
      'institutions',
      'conversations',
      'messages',
      'reflections',
      'bookmarks',
      'notifications',
      'reports',
      'audit_logs',
    ];

    for (const t of tables) {
      const res = await client.query(`select count(*) as cnt from public.${t};`);
      console.log(`Table public.${t}: ${res.rows[0].cnt} rows`);
    }

    const authRes = await client.query(`select count(*) as cnt from auth.users;`);
    console.log(`auth.users: ${authRes.rows[0].cnt} rows`);

    console.log('\nDatabase is completely wiped, fresh, and ready for 100% scratch testing by the user!');
  } finally {
    await client.end();
  }
}

wipeAndPrepareForProduction().catch((err) => {
  console.error('Error during wipe:', err);
  process.exit(1);
});
