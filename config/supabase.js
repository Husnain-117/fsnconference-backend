import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fygesqkltrwgnytvazic.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Z2VzcWtsdHJ3Z255dHZhemljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDA0NzksImV4cCI6MjA3MDE3NjQ3OX0.aWVrh3wcTOnof9Iqd5WBkeYbYu1Dnaxg9gEJa-iOkgM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadToSupabase(buffer, filename) {
  const filePath = `images/${Date.now()}-${filename}`;
  const { data, error } = await supabase
    .storage
    .from('speakers')
    .upload(filePath, buffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/jpeg', // Adjust type as needed
    });

  if (error) throw error;

  // Get public URL
  const { data: publicUrlData } = supabase
    .storage
    .from('speakers')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
