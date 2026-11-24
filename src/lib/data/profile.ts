import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "./keys";
import type { ProfileValues } from "./validation";

const PROFILE_COLUMNS = "id, display_name, locale, timezone, created_at, updated_at";

export interface MyProfile {
  id: string;
  display_name: string | null;
  locale: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

async function selectProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** The signed-in user's own profile (row security limits reads to their own row). */
export const myProfileQuery = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.profile(userId),
    queryFn: async (): Promise<MyProfile | null> => {
      const profile = await selectProfile(userId);
      if (profile) return profile;
      // Missing profile (e.g. the signup trigger failed): create it for this account only.
      const { error } = await supabase.rpc("ensure_my_profile");
      if (error) throw error;
      return selectProfile(userId);
    },
    staleTime: 5 * 60 * 1000,
  });

/** Updates the signed-in user's editable profile fields. */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProfileValues): Promise<MyProfile> => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ display_name: values.displayName, timezone: values.timezone })
        .eq("id", userId)
        .select(PROFILE_COLUMNS)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile(userId), profile);
      // Day boundaries for streaks and calendars depend on the time zone.
      void queryClient.invalidateQueries({ queryKey: queryKeys.activity(userId) });
    },
  });
}
