import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/auth/AuthField";
import { FormAlert } from "@/components/auth/FormAlert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { friendlyDataError } from "@/lib/data/errors";
import { useCreatePalace, useUpdatePalace, type PalaceSummary } from "@/lib/data/palaces";
import {
  PALACE_DESCRIPTION_MAX_LENGTH,
  PALACE_NAME_MAX_LENGTH,
  palaceSchema,
  type PalaceFormInput,
  type PalaceValues,
} from "@/lib/data/validation";

export type PalaceDialogState =
  | { mode: "create"; name?: string; templateKey?: string | null }
  | { mode: "edit"; palace: PalaceSummary };

interface PalaceFormDialogProps {
  userId: string;
  state: PalaceDialogState | null;
  onClose: () => void;
}

const textareaClass =
  "min-h-24 w-full resize-y rounded-xl border-2 border-border bg-card px-4 py-3 text-base text-foreground transition-colors placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 aria-[invalid=true]:border-destructive";

/** Create or rename a palace. Saved to the signed-in user's account. */
export function PalaceFormDialog({ userId, state, onClose }: PalaceFormDialogProps) {
  const create = useCreatePalace(userId);
  const update = useUpdatePalace(userId);
  const [formError, setFormError] = useState<string | null>(null);
  const descriptionId = useId();
  const isEdit = state?.mode === "edit";
  const pending = create.isPending || update.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PalaceFormInput, unknown, PalaceValues>({
    resolver: zodResolver(palaceSchema),
    mode: "onTouched",
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (!state) return;
    setFormError(null);
    reset(
      state.mode === "edit"
        ? { name: state.palace.name, description: state.palace.description ?? "" }
        : { name: state.name ?? "", description: "" },
    );
  }, [state, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!state) return;
    setFormError(null);
    try {
      if (state.mode === "edit") {
        await update.mutateAsync({ id: state.palace.id, ...values });
        toast.success("Palace updated");
      } else {
        await create.mutateAsync({ ...values, templateKey: state.templateKey ?? null });
        toast.success("Palace created", { description: values.name });
      }
      onClose();
    } catch (error) {
      setFormError(friendlyDataError(error));
    }
  });

  return (
    <Dialog open={state !== null} onOpenChange={(open) => !open && !pending && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">
            {isEdit ? "Edit palace" : "Create a palace"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Change the name or notes. Your rooms and stops stay as they are."
              : "Name a place you know by heart. You'll add rooms and stops to it next."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          {formError ? <FormAlert tone="error">{formError}</FormAlert> : null}
          <AuthField
            label="Name"
            placeholder="My childhood home"
            maxLength={PALACE_NAME_MAX_LENGTH + 10}
            autoComplete="off"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="space-y-2">
            <label htmlFor={descriptionId} className="text-sm font-bold text-foreground">
              Notes <span className="font-medium text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id={descriptionId}
              className={textareaClass}
              placeholder="Front door → hallway → kitchen…"
              maxLength={PALACE_DESCRIPTION_MAX_LENGTH + 20}
              aria-invalid={errors.description ? true : undefined}
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-[13px] font-semibold text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Create palace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
