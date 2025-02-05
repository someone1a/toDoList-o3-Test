// src/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Asegúrate de definir estas variables en un archivo .env en la raíz del proyecto o en la configuración de Netlify.
const SUPABASE_URL = "https://ckgnzzhzdczpgawidzvs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZ256emh6ZGN6cGdhd2lkenZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MTI1MTAsImV4cCI6MjA1NDI4ODUxMH0.XzlmYA17X9qw_9ty5parrx_ziu3bFI4aDN1CbIU8GjY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/*
  Configuración de autenticación social:
  En el dashboard de Supabase, habilita Facebook y Google en Auth > Settings > External OAuth Providers.
*/
