import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { NotFoundError } from "./errors";
import { queryKeys } from "./keys";
import type { PalaceValues } from "./validation";

const PALACE_COLUMNS =
  "id, name, description, template_key, sort_order, created_at, updated_at, palace_rooms(count)";

export interface PalaceSummary {
  id: string;
  name: string;
  description: string | null;
  templateKey: string | null;
  createdAt: string;
  updatedAt: string;
  roomCount: number;
}

interface PalaceRow {
  id: string;
  name: string;
  description: string | null;
  template_key: string | null;
  created_at: string;
  updated_at: string;
  palace_rooms: { count: number }[] | null;
}

function toSummary(row: PalaceRow): PalaceSummary {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    templateKey: row.template_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    roomCount: row.palace_rooms?.[0]?.count ?? 0,
  };
}

/** The signed-in user's active (not archived) palaces, newest first. */
export const palacesQuery = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.palaces(userId),
    queryFn: async (): Promise<PalaceSummary[]> => {
      const { data, error } = await supabase
        .from("memory_palaces")
        .select(PALACE_COLUMNS)
        .eq("user_id", userId)
        .is("archived_at", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as PalaceRow[]).map(toSummary);
    },
  });

function useInvalidatePalaces(userId: string) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.palaces(userId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.activity(userId) }),
    ]);
}

export function useCreatePalace(userId: string) {
  const invalidate = useInvalidatePalaces(userId);
  return useMutation({
    mutationFn: async (input: PalaceValues & { templateKey?: string | null }) => {
      // user_id comes from the verified session; row security rejects any other value.
      const { data, error } = await supabase
        .from("memory_palaces")
        .insert({
          user_id: userId,
          name: input.name,
          description: input.description || null,
          template_key: input.templateKey ?? null,
        })
        .select(PALACE_COLUMNS)
        .single();
      if (error) throw error;
      return toSummary(data as unknown as PalaceRow);
    },
    onSettled: invalidate,
  });
}

export function useUpdatePalace(userId: string) {
  const invalidate = useInvalidatePalaces(userId);
  return useMutation({
    mutationFn: async ({ id, ...values }: PalaceValues & { id: string }) => {
      const { data, error } = await supabase
        .from("memory_palaces")
        .update({ name: values.name, description: values.description || null })
        .eq("id", id)
        .eq("user_id", userId)
        .select(PALACE_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new NotFoundError("Palace not found");
      return toSummary(data as unknown as PalaceRow);
    },
    onSettled: invalidate,
  });
}

/** Deletes a palace with its rooms and stops. Fails while memories are still attached to a stop. */
export function useDeletePalace(userId: string) {
  const invalidate = useInvalidatePalaces(userId);
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("memory_palaces")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .select("id");
      if (error) throw error;
      if (!data.length) throw new NotFoundError("Palace not found");
    },
    onSettled: invalidate,
  });
}
