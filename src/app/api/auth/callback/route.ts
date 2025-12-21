import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Validate redirect path to prevent open redirect attacks
function isValidRedirectPath(path: string): boolean {
  // Must start with / and not contain protocol or double slashes
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  // Prevent encoded attacks
  if (path.includes("%2f%2f") || path.includes("%2F%2F")) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Validate redirect path to prevent open redirect attacks
  const safeRedirect = isValidRedirectPath(next) ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeRedirect}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
