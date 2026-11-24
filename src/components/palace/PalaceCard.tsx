import { Castle, DoorOpen, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { palaceEnvironments } from "@/config/palace";
import { friendlyDataError } from "@/lib/data/errors";
import { useDeletePalace, type PalaceSummary } from "@/lib/data/palaces";
import { formatShortDate, pluralize } from "@/lib/data/stats";

interface PalaceCardProps {
  palace: PalaceSummary;
  userId: string;
  timeZone: string;
  onEdit: (palace: PalaceSummary) => void;
}

export function PalaceCard({ palace, userId, timeZone, onEdit }: PalaceCardProps) {
  const remove = useDeletePalace(userId);
  const [confirming, setConfirming] = useState(false);
  const template = palaceEnvironments.find((env) => env.id === palace.templateKey);

  async function handleDelete() {
    try {
      await remove.mutateAsync(palace.id);
      toast.success("Palace deleted", { description: palace.name });
      setConfirming(false);
    } catch (error) {
      toast.error(
        friendlyDataError(error, {
          linked: "Memories are still placed in this palace. Move or delete them first.",
        }),
      );
    }
  }

  return (
    <article className="panel flex h-full flex-col gap-4 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Castle className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-extrabold text-foreground">{palace.name}</h3>
          <p className="text-xs text-muted-foreground">
            Created {formatShortDate(palace.createdAt, timeZone)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Options for ${palace.name}`}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              className="cursor-pointer gap-2 font-semibold"
              onSelect={() => onEdit(palace)}
            >
              <Pencil className="size-4" aria-hidden="true" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer gap-2 font-semibold text-destructive focus:text-destructive"
              onSelect={() => setConfirming(true)}
            >
              <Trash2 className="size-4" aria-hidden="true" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {palace.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {palace.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <Badge variant="outline" className="gap-1.5">
          <DoorOpen className="size-3.5" aria-hidden="true" />
          {palace.roomCount ? pluralize(palace.roomCount, "room") : "No rooms yet"}
        </Badge>
        {template ? <Badge variant="soft">{template.name}</Badge> : null}
      </div>

      <AlertDialog open={confirming} onOpenChange={(open) => !remove.isPending && setConfirming(open)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{palace.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the palace with all its rooms and stops. It can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              disabled={remove.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {remove.isPending ? "Deleting…" : "Delete palace"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
