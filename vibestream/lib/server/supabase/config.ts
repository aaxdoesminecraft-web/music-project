export type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  schema: string;
};

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.SUPABASE_URL ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    schema: process.env.SUPABASE_SCHEMA ?? "public",
  };
}
