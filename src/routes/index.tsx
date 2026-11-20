import { createFileRoute, redirect } from "@tanstack/react-router";

// The root URL always opens the Dashboard.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mentalist — Make your memory extraordinary" },
      {
        name: "description",
        content: "Train your memory with Memory Palaces, proven techniques and playful practice.",
      },
      { property: "og:title", content: "Mentalist — Make your memory extraordinary" },
      {
        property: "og:description",
        content: "Train your memory with Memory Palaces, proven techniques and playful practice.",
      },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
});
