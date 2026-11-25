import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Globe, Mail, Save, UserRound } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { PageHeader } from "@/components/common/PageHeader";
import { PageError, PageLoading } from "@/components/common/PageStatus";
import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/lib/auth/use-session-user";
import { friendlyDataError } from "@/lib/data/errors";
import { myProfileQuery, useUpdateProfile, type MyProfile } from "@/lib/data/profile";
import { formatShortDate } from "@/lib/data/stats";
import {
  isValidTimeZone,
  profileSchema,
  type ProfileFormInput,
  type ProfileValues,
} from "@/lib/data/validation";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Mentalist" },
      { name: "description", content: "Update your Mentalist display name and time zone." },
      { property: "og:title", content: "Your profile — Mentalist" },
      {
        property: "og:description",
        content: "Manage how Mentalist greets you and counts your practice days.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(myProfileQuery(context.user.id)),
  pendingComponent: PageLoading,
  errorComponent: PageError,
  component: ProfilePage,
});

const selectClass =
  "h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-base text-foreground transition-colors hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive disabled:opacity-60";

function allTimeZones(current: string): string[] {
  let zones: string[] = [];
  try {
    zones = Intl.supportedValuesOf("timeZone");
  } catch {
    zones = [];
  }
  const set = new Set(["UTC", ...zones]);
  if (current) set.add(current);
  return [...set].sort((a, b) => (a === "UTC" ? -1 : b === "UTC" ? 1 : a.localeCompare(b)));
}

function deviceTimeZone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(tz) ? tz : null;
  } catch {
    return null;
  }
}

function ProfilePage() {
  const user = useSessionUser();
  const { data: profile } = useSuspenseQuery(myProfileQuery(user.id));

  return (
    <div className="space-y-8 md:space-y-10">
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        icon={UserRound}
        description="How Mentalist greets you, and which time zone counts your practice days."
      />
      {profile ? (
        <ProfileForm profile={profile} email={user.email ?? ""} />
      ) : (
        <FormAlert tone="error">
          We couldn't find your profile yet. Refresh the page in a moment.
        </FormAlert>
      )}
    </div>
  );
}

function ProfileForm({ profile, email }: { profile: MyProfile; email: string }) {
  const update = useUpdateProfile(profile.id);
  const [formError, setFormError] = useState<string | null>(null);
  const timezoneId = useId();
  const zones = useMemo(() => allTimeZones(profile.timezone), [profile.timezone]);
  const device = useMemo(deviceTimeZone, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormInput, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: { displayName: profile.display_name ?? "", timezone: profile.timezone },
  });
  const timezone = watch("timezone");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const saved = await update.mutateAsync(values);
      reset({ displayName: saved.display_name ?? "", timezone: saved.timezone });
      toast.success("Profile saved");
    } catch (error) {
      setFormError(
        friendlyDataError(error, { invalid: "Check your name and time zone, then try again." }),
      );
    }
  });

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <form onSubmit={onSubmit} noValidate className="panel space-y-5 p-5 md:p-6 lg:col-span-3">
        <h2 className="text-lg font-extrabold text-foreground">Profile details</h2>
        {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
        <AuthField
          label="Display name"
          autoComplete="nickname"
          maxLength={60}
          error={errors.displayName?.message}
          hint="Shown in the app menu and on your dashboard."
          {...register("displayName")}
        />
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <label htmlFor={timezoneId} className="text-sm font-bold text-foreground">
              Time zone
            </label>
            {device && device !== timezone ? (
              <button
                type="button"
                onClick={() =>
                  setValue("timezone", device, { shouldDirty: true, shouldValidate: true })
                }
                className="text-[13px] font-bold text-primary hover:underline"
              >
                Use this device's ({device})
              </button>
            ) : null}
          </div>
          <select
            id={timezoneId}
            className={selectClass}
            aria-invalid={errors.timezone ? true : undefined}
            aria-describedby={`${timezoneId}-hint`}
            {...register("timezone")}
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          {errors.timezone ? (
            <p className="text-[13px] font-semibold text-destructive">{errors.timezone.message}</p>
          ) : (
            <p id={`${timezoneId}-hint`} className="text-[13px] text-muted-foreground">
              Decides when a new practice day starts for your streak.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={!isDirty || update.isPending}>
            <Save aria-hidden="true" />
            {update.isPending ? "Saving…" : "Save changes"}
          </Button>
          {isDirty && !update.isPending ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setFormError(null);
                reset();
              }}
            >
              Discard
            </Button>
          ) : null}
        </div>
      </form>

      <section aria-labelledby="account-info" className="panel space-y-4 p-5 md:p-6 lg:col-span-2">
        <h2 id="account-info" className="text-lg font-extrabold text-foreground">
          Account
        </h2>
        <dl className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="font-bold text-foreground">Email</dt>
              <dd className="truncate text-muted-foreground">{email || "—"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <dt className="font-bold text-foreground">Member since</dt>
              <dd className="text-muted-foreground">
                {formatShortDate(profile.created_at, profile.timezone)}
              </dd>
            </div>
          </div>
        </dl>
        <p className="rounded-xl bg-surface-2 px-3 py-2.5 text-[13px] text-muted-foreground">
          Changing your email isn't available yet. To change your password, sign out and use "Forgot
          password?" on the sign-in page.
        </p>
      </section>
    </div>
  );
}
