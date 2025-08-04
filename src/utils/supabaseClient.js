import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ecvebnwrzsnasxkgfoda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdmVibndyenNuYXN4a2dmb2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQ4NTMsImV4cCI6MjA2OTU1MDg1M30.evA1hSw7I6vvXufhXDY4PNuSJ_MaewucjkybXH8lpXo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);