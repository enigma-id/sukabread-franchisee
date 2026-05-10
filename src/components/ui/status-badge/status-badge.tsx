import clsx from "clsx";
import { Badge } from "../badge";
import type { BadgeProps } from "../badge/types";

export type StatusVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "accent"
  | "default";

interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "appearance"> {
  status: string;
  variantMap?: Record<string, StatusVariant>;
  defaultVariant?: StatusVariant;
}

export const StatusBadge = ({
  status,
  variantMap = {
    active: "success",
    completed: "success",
    paid: "success",
    settled: "success",
    success: "success",

    pending: "warning",
    processing: "warning",
    waiting: "warning",
    draft: "warning",

    failed: "error",
    cancelled: "error",
    closed: "error",
    inactive: "error",
    void: "error",

    info: "info",
    new: "info",
  },
  defaultVariant = "default",
  className,
  ...props
}: StatusBadgeProps) => {
  const normalizedStatus = status?.toLowerCase().trim() || "";
  const variant = variantMap[normalizedStatus] || defaultVariant;

  return (
    <Badge
      variant={variant}
      appearance="soft"
      className={clsx("capitalize", className)}
      {...props}
    >
      {status || "-"}
    </Badge>
  );
};
