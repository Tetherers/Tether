import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "@supabase/supabase-js"
import { StringToBoolean } from "class-variance-authority/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
}

export interface Lobby {
  id:string;
  game: {
    id: number;
    name:String;
  }
  players: {
    current: number;
    max: number;
    list: User[];
  }
  status: number;
  created_at: string;
  name: string;
  region: {
    id: number;
    name: string;
  }
}

export interface Game {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
}

export function formatNiceString(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space between consecutive capitals and lowercase
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase() // Convert to lowercase
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
}