import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthPending } from "@/components/auth/AuthPending";
import { FormAlert } from "@/components/auth/FormAlert";
import { Button, buttonVariants } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { friendlyAuthError } from "@/lib/auth/errors";
import {
  PASSWORD_MIN_LENGTH,
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth/validation";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — Mentalist" },
      { name: "description", content: "Set a new password for your Mentalist account." },
      { property: "og:title", content: "Choose a new password — Mentalist" },
      { property: "og:description", content: "Finish resetting your Mentalist password." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { session, isReady, isRecovery } = useAuth();
  const navigate = useNavigate();
  const [linkState, setLinkState] = useState<"checking" | "recovery" | "error">("checking");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  // Read the recovery link details before the auth client clears them from the address bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("error") || params.get("error_code")) setLinkState("error");
    else if (params.get("type") === "recovery") setLinkState("recovery");
    else setLinkState((s) => (s === "checking" ? "error" : s));
  }, []);

  const canReset = Boolean(session) && (isRecovery || linkState === "recovery");

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setFormError(friendlyAuthError(error));
        return;
      }
      toast.success("Password updated. Welcome back!");
      await navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      setFormError(friendlyAuthError(error));
    }
  });

  if (!isReady || linkState === "checking") return <AuthPending />;

  if (!canReset) {
    return (
      <AuthLayout
        icon={LinkIcon}
        title="This link can't be used"
        description="Reset links work once and expire after a while. Request a fresh one and we'll send it to your email."
        footer={
          <Link to="/login" className="font-bold text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        <Link to="/forgot-password" className={buttonVariants({ size: "lg", className: "w-full" })}>
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Choose a new password"
      description="Pick something memorable for you and hard to guess for anyone else."
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
        <AuthField
          label="New password"
          type="password"
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN_LENGTH} characters, with a letter and a number.`}
          error={errors.password?.message}
          {...register("password")}
        />
        <AuthField
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
