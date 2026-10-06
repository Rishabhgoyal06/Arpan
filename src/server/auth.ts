import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://juirpkxejjuijrtrthal.supabase.co';
// Server-side only service-role key — never exposed in client bundle
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXJwa3hlamp1aWpydHJ0aGFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTMwMjg0OSwiZXhwIjoyMTA2ODc4ODQ5fQ.4cmGHHXtzD9HwW1_eEPpvONl6NTfOohXGpjE60GdQUw';

let adminClientInstance: ReturnType<typeof createClient> | null = null;

function getAdminClient() {
  if (!adminClientInstance) {
    adminClientInstance = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClientInstance;
}

export async function handleRegistration(payload: { email: string; password?: string; displayName?: string }) {
  const { email, password, displayName } = payload;
  if (!email || !password) {
    return { error: 'Email and password are required', status: 400 };
  }

  const name = displayName?.trim() || email.split('@')[0] || 'Community Member';
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const adminClient = getAdminClient();

  try {
    // 1. Try creating user with email_confirm: true (bypasses GoTrue email rate limits)
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: formattedName },
    });

    if (error) {
      // If user already exists, update their password and confirm their email so they can log in
      if (error.message.includes('already registered') || error.message.includes('email_exists')) {
        const { data: usersList } = await adminClient.auth.admin.listUsers();
        const existingUser = usersList?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: { display_name: formattedName },
          });

          // Ensure profile exists
          await ensureProfile(existingUser.id, formattedName);
          return { success: true, user: { id: existingUser.id, email: existingUser.email }, message: 'Account updated. Logging in…' };
        }
      }
      return { error: error.message, status: 400 };
    }

    if (data.user) {
      await ensureProfile(data.user.id, formattedName);
      return { success: true, user: { id: data.user.id, email: data.user.email } };
    }

    return { error: 'Failed to create user', status: 500 };
  } catch (err: any) {
    return { error: err?.message || 'Server error during registration', status: 500 };
  }
}

async function ensureProfile(userId: string, displayName: string) {
  try {
    const adminClient = getAdminClient();
    const { data: profile } = await adminClient.from('profiles').select('id').eq('id', userId).maybeSingle();
    if (!profile) {
      await adminClient.from('profiles').insert({
        id: userId,
        display_name: displayName,
        avatar_letter: displayName.charAt(0).toUpperCase(),
        bio: 'Learning to show up with a little more patience. Happy to share what I know.',
        location: 'Bengaluru',
        skills: 'Listening, community support',
        languages: 'English, Hindi',
        availability: 'Weekends',
      });
    }
  } catch (e) {
    console.warn('Failed to ensure profile record:', e);
  }
}
