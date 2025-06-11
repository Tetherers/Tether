import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'api/.env' });
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export function createSupabaseClient(access_token) {
    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        }
    });
}

export function parseAccessToken(req) {
    const authHeader = req.headers['authorization'] || '';
    return authHeader.split(' ')[1];
}
