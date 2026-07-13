"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/records";
import type { ActionState } from "@/types/domain";

export async function authenticateAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check your email and password.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const { email, password, intent } = parsed.data;

  if (intent === "signup") {
    if (process.env.NEXT_PUBLIC_ALLOW_SIGN_UP !== "true") {
      return { ok: false, message: "New account creation is currently disabled." };
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
        data: { display_name: "Diane" },
      },
    });
    if (error) return { ok: false, message: error.message };
    if (!data.session) {
      return {
        ok: true,
        message: "Account created. Check your email to confirm the address, then sign in.",
      };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: "Sign-in failed. Check the email and password and try again." };
  }

  revalidatePath("/", "layout");
  redirect("/home");
}
