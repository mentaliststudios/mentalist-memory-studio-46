import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert } from "@/components/auth/FormAlert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth/errors";
import { parseLoginSearch, safeRedirectPath } from "@/lib/auth/redirect";
import { clearVerifiedUser } from "@/lib/auth/session";
import { loginSchema, type LoginValues } from "@/lib/auth/validation";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: parseLoginSearch,
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ href: safeRedirectPath(search.redirect), replace: true });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Mentalist" },
      { name: "description", content: "Sign in to Mentalist and continue training your memory." },
      { property: "og:title", content: "Sign in — Mentalist" },
      { property: "og:description", content: "Continue building Memory Palaces and training your memory." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setFormError(friendlyAuthError(error));
        return;
      }
      clearVerifiedUser();
      await navigate({ href: safeRedirectPath(search.redirect), replace: true });
    } catch (error) {
      setFormError(friendlyAuthError(error));
    }
  });

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      description="Sign in to pick up where your memory training left off."
      footer={
        <>
          New to Mentalist?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
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
          autoComplete="current-password"
          error={errors.password?.message}
          labelAside={
            <Link to="/forgot-password" className="text-[13px] font-bold text-primary hover:underline">
              Forgot password?
            </Link>
          }
          {...register("password")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthLayout>
  );
}
