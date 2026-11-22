import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert } from "@/components/auth/FormAlert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth/errors";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/auth/validation";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Mentalist" },
      { name: "description", content: "Request a link to reset your Mentalist password." },
      { property: "og:title", content: "Reset your password — Mentalist" },
      { property: "og:description", content: "Get back into your Mentalist account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [requestedFor, setRequestedFor] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setFormError(friendlyAuthError(error));
        return;
      }
      setRequestedFor(email);
    } catch (error) {
      setFormError(friendlyAuthError(error));
    }
  });

  const footer = (
    <>
      Remembered it?{" "}
      <Link to="/login" className="font-bold text-primary hover:underline">
        Back to sign in
      </Link>
    </>
  );

  if (requestedFor) {
    return (
      <AuthLayout
        icon={MailCheck}
        title="Request received"
        description={
          <>
            If an account exists for{" "}
            <strong className="font-bold text-foreground">{requestedFor}</strong>, you'll get an
            email with a link to choose a new password.
          </>
        }
        footer={footer}
      >
        <FormAlert tone="success">
          The link expires after a while, so use it soon. Check your spam folder if it doesn't
          arrive.
        </FormAlert>
        <Button variant="outline" className="mt-5 w-full" onClick={() => setRequestedFor(null)}>
          Try another email
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Forgot your password?"
      description="It happens to the best memories. Enter your email and we'll send you a reset link."
      footer={footer}
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
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>
    </AuthLayout>
  );
}
