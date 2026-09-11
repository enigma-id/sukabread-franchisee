import type { CashierDeviceStatus } from "@/services/types/reports";

/**
 * Status recency device operator (dari `max(sales_session_device_log.created_at)`):
 * `online` ≤5 menit, `stale` 5–15 menit, `offline` >15 menit / belum ada log.
 */
export const DEVICE_STATUS_COLOR: Record<string, string> = {
  online: "#10b981",
  stale: "#f59e0b",
  offline: "#94a3b8",
};

export const DEVICE_STATUS_LABEL: Record<string, string> = {
  online: "Online",
  stale: "Stale",
  offline: "Offline",
};

export const deviceStatusColor = (status?: CashierDeviceStatus | string) =>
  DEVICE_STATUS_COLOR[status ?? "offline"] ?? DEVICE_STATUS_COLOR.offline;

export const deviceStatusLabel = (status?: CashierDeviceStatus | string) =>
  DEVICE_STATUS_LABEL[status ?? "offline"] ?? DEVICE_STATUS_LABEL.offline;
