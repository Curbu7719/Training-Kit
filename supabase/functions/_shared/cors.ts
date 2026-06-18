// _shared/cors.ts
//
// Standard CORS headers for all TrainingKit edge functions.
// Functions are invoked from the browser via supabase.functions.invoke(),
// which sends a cross-origin request to *.supabase.co.
//
// Usage:
//   import { corsHeaders, handleCors } from '../_shared/cors.ts';
//
//   Deno.serve(async (req) => {
//     const preflight = handleCors(req);
//     if (preflight) return preflight;
//     // ... handler logic ...
//     return new Response(body, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
//   });

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

/**
 * Handle an OPTIONS preflight request.
 * Returns a 200 response with CORS headers if the request is OPTIONS,
 * or null if the caller should continue processing the request.
 */
export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  return null;
}
