import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { MailCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert } from "@/components/auth/FormAlert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, isAlreadyRegistered } from "@/lib/auth/errors";
import { DEFAULT_AFTER_LOGIN } from "@/lib/auth/redirect";
import { PASSWORD_MIN_LENGTH, signupSchema, type SignupValues } from "@/lib/auth/validation";

export const Route = createFileRoute("/signup")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard", replace: true });
  },
  head: () => ({
    meta: [
      { title: "Create your account — Mentalist" },
      {
        name: "description",
        content: "Create a free Mentalist account to build Memory Palaces and train your memory.",
      },
      { property: "og:title", content: "Create your account — Mentalist" },
      {
        property: "og:description",
        content: "Start making your memory extraordinary with Memory Palaces and playful practice.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema), mode: "onTouched" });

  const onSubmit = handleSubmit(async ({ displayName, email, password }) => {
    setFormError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: { display_name: displayName },
        },
      });
      // Same confirmation screen whether or not the email was already registered (no account enumeration).
      if (error && !isAlreadyRegistered(error)) {
        setFormError(friendlyAuthError(error));
        return;
      }
      if (data.session) {
        await navigate({ to: DEFAULT_AFTER_LOGIN, replace: true });
        return;
      }
      setSentTo(email);
    } catch (error) {
      setFormError(friendlyAuthError(error));
    }
  });

  if (sentTo) {
    return (
      <AuthLayout
        icon={MailCheck}
        title="Check your inbox"
        description={
          <>
            If <strong className="font-bold text-foreground">{sentTo}</strong> can be used for a new
            account, a confirmation link is on its way. Open it to activate your account, then sign
            in.
          </>
        }
        footer={
          <>
            Already confirmed?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <FormAlert tone="success">
          Can't find it? Check your spam folder. The link works once.
        </FormAlert>
        <Button variant="outline" className="mt-5 w-full" onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Sparkles}
      title="Create your account"
      description="Your memory space is a minute away. Everything you create stays private to you."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
        <AuthField
          label="Display name"
          autoComplete="nickname"
          autoCapitalize="words"
          maxLength={50}
          placeholder="What should we call you?"
          error={errors.displayName?.message}
          {...register("displayName")}
        />
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <AuthField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN_LENGTH} characters, with a letter and a number.`}
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
